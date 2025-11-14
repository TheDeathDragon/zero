import { getAllPosts } from '@/lib/mdx'
import PostList from '@/components/PostList'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function Page() {
  const allPosts = await getAllPosts()
  const postList = allPosts.filter(
    (post) => post.category !== '一心净土' && post.category !== '真我之名'
  )

  return <PostList initialPosts={postList} />
}
