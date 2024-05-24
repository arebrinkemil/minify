'use client'

import { useEffect, useState } from 'react'

type SizeType = {
  width: number
  height: number
}

const useWindowSize = () => {
  const [size, setSize] = useState<SizeType | null>(null)

  useEffect(() => {
    const handleSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleSize()

    window.addEventListener('resize', handleSize)

    return () => {
      window.removeEventListener('resize', handleSize)
    }
  }, [])

  return size
}

export default useWindowSize
