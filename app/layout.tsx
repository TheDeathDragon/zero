import type { ReactNode } from 'react'
import { Metadata } from 'next'
// Google Fonts 在某些环境可能无法访问，如需使用请取消注释
// import { Noto_Serif_SC } from 'next/font/google'
import 'aos/dist/aos.css'
// import Cloud from '@/components/Cloud'
import Header from '@/components/Header'
import Side from '@/components/Side'
import ThemeProvider from './context'
import './globals.css'

// const serif = Noto_Serif_SC({
//   subsets: ['latin'],
//   weight: '500',
//   display: 'swap',
//   variable: '--font-serif',
// })

export const metadata: Metadata = {
  title: '雪落的小屋',
  description: '刹那烟火人间',
  authors: [{ name: '雪落的小屋', url: 'https://Shiro.la' }],
  keywords: '雪落的小屋',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          {/* <Cloud /> */}
          <Header />
          <Side />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
