/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import type { Inspiration } from '@/type'
import type { Post } from 'contentlayer/generated'
import AOS from 'aos'
import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import MDX from '@/components/MDX'

export default function InspirationLayout() {
  const postList: Post[] = allPosts
    .filter((post) => post.category === '一心净土')
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  const [page, setPage] = useState(1)
  const [inspirations, setInspirations] = useState<Inspiration[]>([])
  const maskRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef<any>(null)
  const timerRef = useRef<number>()
  const finishedRef = useRef<boolean>(false)
  const unactiveRef = useRef<boolean>(false)
  const [maskHeight, setMaskHeight] = useState(0)
  const [maskTop, setMaskTop] = useState(0)

  const list = useMemo(() => {
    const result: Inspiration[] = []
    postList.forEach((post) => {
      result.push(...post.inspiration.reverse())
    })
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const data = list.slice((page - 1) * 10, page * 10)
    if (data.length) {
      setInspirations([...inspirations, ...data])
    } else {
      finishedRef.current = true
    }

    if (maskHeight === 0) {
      setTimeout(() => {
        const target = listRef.current?.firstChild
        if (target) {
          calcMaskPos(target)
        }
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const calcMaskPos = (target: any) => {
    const { clientHeight, offsetTop } = target
    const paddingTop = 3 * 16
    const realTop = offsetTop + paddingTop
    if (maskHeight === clientHeight && maskTop === realTop) return
    setMaskHeight(clientHeight)
    setMaskTop(realTop)
  }

  const handleMask = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    hoverRef.current = e.currentTarget
    calcMaskPos(e.currentTarget)
  }

  const handleScroll = () => {
    if (unactiveRef.current) return
    clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (hoverRef.current) {
        calcMaskPos(hoverRef.current)
      }
    }, 100)
    // load more
    if (finishedRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (scrollTop + clientHeight > scrollHeight - 100) {
      setPage((page) => page + 1)
    }
  }

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: 'ease',
      debounceDelay: 50,
      throttleDelay: 100,
      offset: 0,
    })

    window.addEventListener('scroll', handleScroll, false)
    return () => window.removeEventListener('scroll', handleScroll, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="page py-12">
      <div
        ref={maskRef}
        className="mask pointer-events-none absolute left-0 top-0 w-full transform rounded transition-all duration-300 ease-in-out"
        style={{
          height: `${maskHeight}px`,
          transform: `translateY(${maskTop}px)`,
        }}
      ></div>
      <div ref={listRef} className="relative space-y-4">
        {inspirations.map((inspiration) => {
          return (
            <article
              key={inspiration.title}
              className="cursor-pointer overflow-x-hidden py-4 sm:px-4"
              data-aos="fade-left"
              onMouseOver={handleMask}
              onMouseEnter={handleMask}
            >
              <h2 className="mb-2 text-xl italic">{inspiration.title}</h2>
              <MDX code={inspiration.code} />
            </article>
          )
        })}
      </div>
    </div>
  )
}