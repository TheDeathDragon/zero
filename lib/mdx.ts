import type { Inspiration, Post } from '@/type'
import matter from 'gray-matter'
import { getAllMarkdownFiles, getFileContentRaw } from './github'

/**
 * 生成文章摘要
 * @param content - Markdown 内容
 * @returns 摘要文本
 */
function generateSummary(content: string): string {
  // 分割成段落
  const paragraphs = content.split('\n\n')

  // 找到第一个非空段落
  let firstParagraph = ''
  for (const para of paragraphs) {
    const trimmed = para.trim()
    // 跳过标题、代码块、引用等
    if (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('```') &&
      !trimmed.startsWith('>') &&
      !trimmed.startsWith('|') &&
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('*')
    ) {
      firstParagraph = trimmed
      break
    }
  }

  // 如果没找到合适的段落，取第一段
  if (!firstParagraph && paragraphs.length > 0) {
    firstParagraph = paragraphs[0].trim()
  }

  // 去除 markdown 语法
  let summary = firstParagraph
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/`([^`]+)`/g, '$1') // 行内代码
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 加粗
    .replace(/\*([^*]+)\*/g, '$1') // 斜体
    .replace(/__([^_]+)__/g, '$1') // 加粗
    .replace(/_([^_]+)_/g, '$1') // 斜体
    .replace(/~~([^~]+)~~/g, '$1') // 删除线
    .replace(/\n/g, ' ') // 换行改为空格
    .replace(/\s+/g, ' ') // 多个空格合并为一个
    .trim()

  // 限制长度为 150 字符
  const maxLength = 150
  if (summary.length > maxLength) {
    // 在最后一个空格处截断，避免在词中间截断
    const truncated = summary.slice(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    summary = (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + '...'
  }

  return summary || '暂无摘要'
}

/**
 * 解析单个 Markdown 文件（轻量级，不编译 MDX）
 * @param content - Markdown 内容
 * @returns Post 对象
 */
export async function parseMarkdownFile(content: string): Promise<Post> {
  const { data, content: rawContent } = matter(content)

  // 提取 frontmatter
  const title = data.title as string
  const date = data.date as string
  const category = data.category as string
  const tags = (data.tags as string[]) || []
  const description = data.description as string | undefined

  // 生成 slug（使用标题）
  const slug = title

  // 生成摘要（提取第一段，去除 markdown 语法）
  const summaryText = generateSummary(rawContent)

  // 处理灵感内容（"一心净土"分类）- 只提取标题和摘要
  const inspirations: Inspiration[] = []
  if (category === '一心净土') {
    const lines = rawContent.split('\n')
    let currentTitle = ''
    let currentContent: string[] = []

    for (const line of lines) {
      if (line.startsWith('## ')) {
        // 保存上一个灵感
        if (currentTitle && currentContent.length > 0) {
          const inspirationText = currentContent.join('\n')
          // 生成灵感摘要
          const inspirationSummary = generateSummary(inspirationText)
          inspirations.push({
            title: currentTitle,
            raw: inspirationSummary,
            code: '', // 不在列表加载时编译，按需编译
          })
        }
        // 开始新的灵感
        currentTitle = line.replace('## ', '').trim()
        currentContent = []
      } else if (currentTitle) {
        currentContent.push(line)
      }
    }

    // 保存最后一个灵感
    if (currentTitle && currentContent.length > 0) {
      const inspirationText = currentContent.join('\n')
      // 生成灵感摘要
      const inspirationSummary = generateSummary(inspirationText)
      inspirations.push({
        title: currentTitle,
        raw: inspirationSummary,
        code: '', // 不在列表加载时编译，按需编译
      })
    }
  }

  return {
    title,
    date,
    category,
    tags,
    description,
    content: rawContent,
    slug,
    summary: {
      code: '', // 不在列表加载时编译，使用 raw
      raw: summaryText,
    },
    body: {
      code: '', // 不在列表加载时编译，在详情页按需编译
      raw: rawContent,
    },
    inspiration: inspirations,
  }
}

/**
 * 获取所有文章
 * @returns Post 数组
 */
export async function getAllPosts(): Promise<Post[]> {
  const files = await getAllMarkdownFiles()
  const posts: Post[] = []

  // 并行处理以提高性能
  const postPromises = files.map(async (file) => {
    try {
      const content = await getFileContentRaw(file.path)
      return await parseMarkdownFile(content)
    } catch (error) {
      console.error(`Error parsing file ${file.path}:`, error)
      return null
    }
  })

  const results = await Promise.all(postPromises)
  posts.push(...results.filter((post): post is Post => post !== null))

  // 按日期排序
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 根据 slug 获取单篇文章
 * @param slug - 文章 slug（标题）
 * @returns Post 对象或 null
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === decodeURIComponent(slug)) || null
}

/**
 * 获取所有文章的 slugs（用于生成静态路径）
 * @returns slug 数组
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts()
  return posts.map((post) => post.slug)
}
