import { compileMDX } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { getAllMarkdownFiles, getFileContentRaw } from './github'
import type { Inspiration, Post } from '@/type'

/**
 * 解析单个 Markdown 文件
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

  // 编译完整内容
  const { content: body } = await compileMDX({
    source: rawContent,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypeExternalLinks, { rel: ['nofollow'] }],
          [
            rehypePrettyCode,
            {
              theme: 'material-theme-lighter',
            },
          ],
        ],
      },
    },
  })

  // 生成摘要（取前 200 个字符）
  const summaryText = rawContent.slice(0, 200).trim() + (rawContent.length > 200 ? '...' : '')
  const { content: summaryContent } = await compileMDX({
    source: summaryText,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  // 处理灵感内容（"一心净土"分类）
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
          const { content: inspirationContent } = await compileMDX({
            source: inspirationText,
            options: {
              parseFrontmatter: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            },
          })
          inspirations.push({
            title: currentTitle,
            raw: inspirationText,
            code: JSON.stringify(inspirationContent),
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
      const { content: inspirationContent } = await compileMDX({
        source: inspirationText,
        options: {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      })
      inspirations.push({
        title: currentTitle,
        raw: inspirationText,
        code: JSON.stringify(inspirationContent),
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
      code: JSON.stringify(summaryContent),
      raw: summaryText,
    },
    body: {
      code: JSON.stringify(body),
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

  for (const file of files) {
    try {
      const content = await getFileContentRaw(file.path)
      const post = await parseMarkdownFile(content)
      posts.push(post)
    } catch (error) {
      console.error(`Error parsing file ${file.path}:`, error)
    }
  }

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
