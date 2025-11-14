import { unstable_cache } from 'next/cache'
import matter from 'gray-matter'
import { getAllMarkdownFiles, getFileContentRaw } from './github'
import type { Inspiration, Post } from '@/type'

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

  // 生成摘要（取前 200 个字符，纯文本，不编译）
  const summaryText = rawContent.slice(0, 200).trim() + (rawContent.length > 200 ? '...' : '')

  // 处理灵感内容（"一心净土"分类）- 只提取标题和原始内容，不编译
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
          inspirations.push({
            title: currentTitle,
            raw: inspirationText,
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
      inspirations.push({
        title: currentTitle,
        raw: inspirationText,
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
 * 获取所有文章（内部实现）
 * @returns Post 数组
 */
async function getAllPostsInternal(): Promise<Post[]> {
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
 * 获取所有文章（带缓存）
 * @returns Post 数组
 */
export const getAllPosts = unstable_cache(
  async () => getAllPostsInternal(),
  ['all-posts'],
  {
    revalidate: 3600, // 缓存 1 小时
    tags: ['posts'],
  }
)

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
