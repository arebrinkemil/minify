// components/HomeMenu.tsx
'use client'
import React from 'react'

import HomeForm from './HomeForm'
import HomeAccordion from './HomeAccordion'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const HomeMenu = () => {
  const [shortUrl, setShortUrl] = React.useState<string | null>(null)

  const handleShortUrlGenerated = (url: string) => {
    setShortUrl(url)
  }

  const domain = process.env.NEXT_PUBLIC_BASE_URL
  const fullLink = `${domain}/url/${shortUrl}`

  const copyLink = () => {
    navigator.clipboard.writeText(fullLink)
  }

  return (
    <main className='mx-auto flex max-w-[500px] flex-col py-[120px] text-center'>
      <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Minify
      </h2>
      <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
        URL Shortener
      </h4>

      <HomeForm onShortUrlGenerated={handleShortUrlGenerated} />

      {shortUrl && (
        <div onClick={copyLink} className=''>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <h4 className='mt-4 scroll-m-20 text-xl font-semibold tracking-tight'>
                  Shortened URL:
                </h4>
                <h4 className='scroll-m-20 text-xl font-semibold tracking-tight hover:scale-105'>
                  {fullLink}
                </h4>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <HomeAccordion />
    </main>
  )
}

export default HomeMenu
