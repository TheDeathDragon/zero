import PostList from '@/components/PostList'
import { getAllPosts } from '@/lib/mdx'

export default async function Page() {
  const allPosts = await getAllPosts()
  const postList = allPosts.filter((post) => post.category !== '一心净土' && post.category !== '真我之名')

  return <PostList initialPosts={postList} />
}
