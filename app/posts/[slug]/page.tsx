import { format } from 'date-fns'
import { Bookmark, Calendar, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import Comment from '@/components/Comment'
import { getPostBySlug } from '@/lib/mdx'
import Image from '@/components/MDX/Image'

// 使用动态路由，在运行时生成
export const revalidate = 3600 // 缓存 1 小时

// export const generateStaticParams = async () => {
//   const slugs = await getAllPostSlugs()
//   return slugs.map((slug) => ({ slug }))
// }

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  const post = await getPostBySlug(params.slug)
  return {
    title: `${post?.title} - 雪落的小屋`,
    description: post?.description,
    keywords: post?.tags.join(','),
  }
}

export default async function PostLayout({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return notFound()
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
    <div className="page">
      <article>
        <h2 className="mb-6 text-4xl italic">{post.title}</h2>
        <div className="meta mb-12 flex flex-wrap justify-start">
          <Calendar className="mr-1" />
          {format(new Date(post.date), 'yyyy-MM-dd')}
          <Bookmark className="ml-4 mr-1" />
          {post.category}
          <Tag className="ml-4 mr-1" />
          {post.tags.map((tag) => (
            <span key={tag} className="mr-2">
              {tag.trim()}
            </span>
          ))}
        </div>
        <div className="prose max-w-full">{content}</div>
      </article>
      <Comment term={post.title} />
    </div>
  )
}
