'use client'

import { UrlType } from '@/app/dashboard/page'
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  FC,
  ReactNode,
  useState,
} from 'react'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import useWindowSize from '@/hooks/useWindowSize'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type UrlListProps = {
  urls: UrlType[]
}

type MenuProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

const MenuButton: FC<MenuProps> = ({ children, ...props }) => {
  return (
    <Button variant={'outline'} className='w-fit px-2' {...props}>
      {children}
    </Button>
  )
}

const UrlList: FC<UrlListProps> = ({ urls }) => {
  const [showList, setShowList] = useState(false)
  const [search, setSearch] = useState('')
  const [urlList, setUrlList] = useState<UrlType[]>(urls)
  const [selectedUrl, setSelectedUrl] = useState<UrlType | null>(null)

  const size = useWindowSize()

  const handleSearch = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target

    const filterUrls = urls.filter(url => {
      if (url.original_url.includes(value)) return true
      if (url.full_short.includes(value)) return true
      return false
    })

    setUrlList(filterUrls)
    setSearch(value)
  }

  const prettierUrl = (url: string): string => {
    return url.replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '')
  }

  const selectUrl = (url: UrlType): void => {
    setShowList(false)
    setSelectedUrl(url)
  }

  return (
    <section className='flex h-full flex-col gap-4 lg:flex-row'>
      <Card
        className={cn(
          'absolute right-full h-[calc(100vh-79px-32px)] w-[calc(100vw-48px)] max-w-[400px] transition-all duration-300 lg:static',
          {
            'translate-x-[calc(100%+24px)]':
              showList && size && size.width <= 1024,
          },
        )}
      >
        <CardHeader className='flex-row items-center gap-2'>
          {size && size.width <= 1014 && (
            <MenuButton onClick={() => setShowList(prev => !prev)}>
              <X />
            </MenuButton>
          )}
          <Input
            type='text'
            placeholder='Search ...'
            value={search}
            style={{ marginTop: 0 }}
            onChange={handleSearch}
          />
        </CardHeader>
        <CardContent>
          <div>
            {urlList.map(url => (
              <Button
                key={url.full_short}
                variant={'ghost'}
                className={cn('w-full justify-start', {
                  'bg-accent': url.short_url === selectedUrl?.short_url,
                })}
                onClick={() => selectUrl(url)}
              >
                <p className='w-full overflow-hidden text-ellipsis text-start'>
                  {prettierUrl(url.original_url)}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className='flex-grow'>
        {size && size.width <= 1024 && (
          <CardHeader>
            <MenuButton onClick={() => setShowList(prev => !prev)}>
              <Menu />
            </MenuButton>
          </CardHeader>
        )}
        <CardContent className='lg:py-4'>URL FORM</CardContent>
      </Card>
    </section>
  )
}

export default UrlList
