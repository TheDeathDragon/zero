import { getAllPosts } from '@/lib/mdx'
import PostList from '@/components/PostList'

export const revalidate = 3600 // 缓存 1 小时

export default async function Page() {
  const allPosts = await getAllPosts()
  const postList = allPosts.filter(
    (post) => post.category !== '一心净土' && post.category !== '真我之名'
  )

  return <PostList initialPosts={postList} />
}
