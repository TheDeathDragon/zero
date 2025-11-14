import type { Inspiration } from '@/type'
import InspirationList from '@/components/InspirationList'
import { getAllPosts } from '@/lib/mdx'

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
