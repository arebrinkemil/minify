'use client'

import * as React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return (
      <Button variant='default' size='icon' aria-label='Toggle theme'>
        <Sun className='h-[1.2rem] w-[1.2rem] transition-all' />
      </Button>
    )
  }

  return (
    <Button
      variant='default'
      size='icon'
      onClick={toggleTheme}
      aria-label='Toggle theme'
    >
      {resolvedTheme === 'light' ? (
        <Moon className='h-[1.2rem] w-[1.2rem] transition-all' />
      ) : (
        <Sun className='h-[1.2rem] w-[1.2rem] transition-all' />
      )}
    </Button>
  )
}
