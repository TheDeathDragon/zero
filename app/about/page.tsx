import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import Comment from '@/components/Comment'
import { getAllPosts } from '@/lib/mdx'
import Image from '@/components/MDX/Image'

export const revalidate = 3600 // 缓存 1 小时

export default async function AboutLayout() {
  const allPosts = await getAllPosts()
  const post = allPosts.find((post) => post.category === '真我之名')

  if (!post) {
    return <div className="page">暂无关于页面内容</div>
  }

  // 编译 MDX 内容
  const { content } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: true,
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
    components: {
      img: Image,
    },
  })

  return (
    <div className="page prose max-w-full">
      <article>{content}</article>
      <Comment term="关于" />
    </div>
  )
}
