'use client'

import { useState } from 'react'
import HomeAccordion from './HomeAccordion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import UrlForm from './UrlForm'

const HomeMenu = () => {
  const [url, setUrl] = useState('')

  const copyLink = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <main className='mx-auto flex max-w-[500px] flex-col py-[120px] text-center'>
      <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
        Minify
      </h2>
      <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
        URL Shortener
      </h4>
      <UrlForm setValue={setUrl} />
      {url.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={copyLink}>
              <h4 className='mt-4 scroll-m-20 text-xl font-semibold tracking-tight'>
                Shortened URL:
              </h4>
              <h4 className='scroll-m-20 text-xl font-semibold tracking-tight hover:scale-105'>
                {url}
              </h4>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <HomeAccordion />
    </main>
  )
}

export default HomeMenu
