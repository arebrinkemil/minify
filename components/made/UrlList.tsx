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
import UrlForm, { ResponseDataType, formSchema } from './UrlForm'
import ClipbordCopy from './ClipbordCopy'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { updateUrlSchema } from '@/app/api/user/url/[slug]/schema'

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
  const [initUrls, setInitUrls] = useState<UrlType[]>(urls)
  const [urlList, setUrlList] = useState<UrlType[]>(urls)
  const [selectedUrl, setSelectedUrl] = useState<UrlType | null>(null)

  const size = useWindowSize()
  const session = useSession()

  const handleSearch = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target

    const filterUrls = initUrls.filter(url => {
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

  const handleSubmit = (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>, any, undefined>,
  ) => {
    const submitPromise = new Promise(async (resolve, reject) => {
      const user = session.data?.user
      if (!selectedUrl || !user) return

      try {
        const { url, expires, maxAmount, shortUrl } = values

        const body: z.infer<typeof updateUrlSchema> = {
          original_url: url,
          expires_at: expires,
          max_views: maxAmount ? parseInt(maxAmount) : undefined,
          user_id: user.id,
          short_url: shortUrl || '',
        }

        const req: RequestInit = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/url/${selectedUrl?.short_url}`,
          req,
        )

        if (!res.ok) {
          reject(new Error('Error saving url'))
          return
        }

        const data = (await res.json()) as ResponseDataType

        if (!data.success) {
          reject(data.error)
          return
        }

        const { original_url, expires_at, max_views, short_url } = data.data

        const updatedUrl: UrlType = {
          ...selectedUrl,
          full_short: `${process.env.NEXT_PUBLIC_BASE_URL}/url/${short_url}`,
          expires_at,
          max_views,
          original_url,
          short_url,
        }

        setSelectedUrl(updatedUrl)

        // Update selected url in url list
        const selectedIndex = urlList.findIndex(
          url => url.short_url === updatedUrl.short_url,
        )
        let list = [...initUrls]
        list[selectedIndex] = updatedUrl

        setInitUrls(list)
        setUrlList(list)

        form.reset()
        resolve(res.ok)
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error)
        }

        reject({ message: 'Error saving url' })
      }
    })

    toast.promise(submitPromise, {
      loading: 'Saving url',
      success: 'Url saved successfully',
      error: (error: Error) => error.message,
    })
  }

  return (
    <section className='flex h-full flex-col gap-4 lg:flex-row'>
      <Card
        className={cn(
          'absolute right-full h-[calc(100vh-79px-32px)] w-[calc(100vw-48px)] max-w-[500px] transition-all duration-300 lg:static',
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
        <CardContent className='h-full lg:py-4'>
          {selectedUrl ? (
            <section className='flex flex-col gap-6 md:gap-16'>
              <ClipbordCopy url={selectedUrl?.full_short || ''} />
              <UrlForm
                initialValue={{
                  url: selectedUrl.original_url,
                  expires: selectedUrl.expires_at
                    ? new Date(selectedUrl.expires_at)
                    : undefined,
                  maxAmount: selectedUrl.max_views
                    ? selectedUrl.max_views.toString()
                    : '',
                  shortUrl: selectedUrl.short_url,
                  views: selectedUrl.views.toString(),
                }}
                onSubmit={handleSubmit}
              />
              <Card className='flex flex-row items-center justify-between p-2'>
                <h1>
                  {selectedUrl.views >= selectedUrl.max_views
                    ? 'The link has reached its maximum view limit.'
                    : `The link has been viewed ${selectedUrl.views.toString()} times`}
                </h1>
                {selectedUrl.views >= selectedUrl.max_views && (
                  <Button
                    onClick={() => {
                      setSelectedUrl({
                        ...selectedUrl,
                        max_views: selectedUrl.max_views + 10,
                      })
                    }}
                  >
                    Increase Max Views
                  </Button>
                )}
              </Card>
            </section>
          ) : (
            <div className='grid h-full place-content-center text-lg font-medium text-border'>
              &larr; Select a URL
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export default UrlList
