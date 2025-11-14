interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: 'file' | 'dir'
}

interface GitHubContent {
  content: string
  encoding: string
}

const GITHUB_API = 'https://api.github.com'
const REPO_OWNER = 'TheDeathDragon'
const REPO_NAME = 'blog'
const CONTENT_PATH = '時雨'

/**
 * 获取 GitHub 文件列表
 * @param path - 文件路径（相对于仓库根目录）
 * @returns 文件列表
 */
export async function getGitHubFiles(path: string = CONTENT_PATH): Promise<GitHubFile[]> {
  const url = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    },
    next: {
      revalidate: 3600, // 缓存 1 小时
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * 递归获取所有 Markdown 文件
 * @param path - 起始路径
 * @returns Markdown 文件列表
 */
export async function getAllMarkdownFiles(path: string = CONTENT_PATH): Promise<GitHubFile[]> {
  const files = await getGitHubFiles(path)
  const markdownFiles: GitHubFile[] = []

  for (const file of files) {
    if (file.type === 'dir') {
      // 递归获取子目录中的文件
      const subFiles = await getAllMarkdownFiles(file.path)
      markdownFiles.push(...subFiles)
    } else if (file.name.endsWith('.md')) {
      markdownFiles.push(file)
    }
  }

  return markdownFiles
}

/**
 * 获取文件内容
 * @param path - 文件路径
 * @returns 文件内容（解码后的文本）
 */
export async function getFileContent(path: string): Promise<string> {
  const url = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    },
    next: {
      revalidate: 3600, // 缓存 1 小时
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`)
  }

  const data: GitHubContent = await response.json()

  // 解码 base64 内容
  if (data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }

  return data.content
}

/**
 * 使用 Raw Content URL 直接获取文件内容（更快，适合公开仓库）
 * @param path - 文件路径
 * @returns 文件内容
 */
export async function getFileContentRaw(path: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}`

  const response = await fetch(url, {
    next: {
      revalidate: 3600, // 缓存 1 小时
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub Raw Content Error: ${response.status} ${response.statusText}`)
  }

  return response.text()
}
