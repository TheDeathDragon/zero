import clsx from 'clsx'
import localFont from 'next/font/local'
import { FC } from 'react'
import Poetry from '@/components/Poetry'

const siteFont = localFont({ src: '../../assets/font/LxgwWenKai.otf', display: 'swap' })

const Site: FC = () => (
  <div className="flex flex-1 flex-col justify-end pb-3 pl-3">
    <div className={clsx(siteFont.className, 'pb-12 tracking-wider')}>
      <h3 className="text-6xl">雪落的小屋</h3>
      <span className="inline-block pl-1 pt-2 text-xl">刹那烟火人间</span>
    </div>
    <Poetry />
  </div>
)

export default Site
