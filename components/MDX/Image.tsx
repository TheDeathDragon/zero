'use client'

import type { ImageProps } from 'next/image'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import clsx from 'clsx'
import NextImage from 'next/image'
import { useState } from 'react'
import { PhotoView } from '@/components/PhotoView'
import Spinner from '@/components/Spinner'

/**
 * 转换图片路径为 GitHub Raw URL
 * @param src - 原始图片路径
 * @returns GitHub Raw URL 或原始路径
 */
function convertImagePath(src?: string): string {
  if (!src) return ''

  // 如果是绝对路径（http/https），直接返回
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  // 如果是相对路径，转换为 GitHub Raw URL
  // 例如：IMAGES/xxx.png -> https://raw.githubusercontent.com/TheDeathDragon/blog/main/IMAGES/xxx.png
  const cleanPath = src.startsWith('/') ? src.slice(1) : src
  return `https://raw.githubusercontent.com/TheDeathDragon/blog/main/${cleanPath}`
}

const Image = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
  const [isReady, setIsReady] = useState(false)
  const imageSrc = convertImagePath(props.src)

  return (
    <>
      <PhotoView src={imageSrc}>
        <NextImage
          {...(props as ImageProps)}
          src={imageSrc}
          priority
          alt={props.alt ?? ''}
          onLoadingComplete={() => setIsReady(true)}
          onError={() => setIsReady(false)}
          className={clsx('opacity-0 transition-opacity duration-500', isReady && 'opacity-100')}
          width={800}
          height={600}
          unoptimized
        />
      </PhotoView>
      {!isReady && <Spinner />}
      {props.alt && <span className="mb-8 block text-center italic">◭ {props.alt}</span>}
    </>
  )
}

export default Image
