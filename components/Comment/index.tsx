'use client'

import Giscus from '@giscus/react'
import { FC, useContext } from 'react'
import { ThemeContext } from '@/app/context'

interface CommentProps {
  term: string
}

const Comment: FC<CommentProps> = ({ term }) => {
  const { theme } = useContext(ThemeContext)

  return (
    <div className="mt-16">
      <Giscus
        id="comment"
        repo="TheDeathDragon/blog"
        repoId="R_kgDOLCwt_w="
        category="Announcements"
        categoryId="DIC_kwDOLCwt_84CcT0t"
        mapping="specific"
        term={term}
        reactionsEnabled="0"
        emitMetadata="0"
        inputPosition="top"
        theme={`/assets/styles/${theme.toLowerCase()}.css`}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}

export default Comment
