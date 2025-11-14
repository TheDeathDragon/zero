import type { Inspiration } from '@/type'
import { getAllPosts } from '@/lib/mdx'
import InspirationList from '@/components/InspirationList'

export const revalidate = 3600 // 缓存 1 小时

export default async function InspirationLayout() {
  const allPosts = await getAllPosts()
  const postList = allPosts.filter((post) => post.category === '一心净土')

  // 提取所有灵感内容
  const allInspirations: Inspiration[] = []
  postList.forEach((post) => {
    allInspirations.push(...post.inspiration)
  })

  return <InspirationList allInspirations={allInspirations} />
}
