import { FC } from 'react'
import { cookies } from 'next/headers'
import UrlList from '@/components/made/UrlList'

type DashboardProps = {}
export type UrlType = {
  original_url: string
  short_url: string
  created_at: string
  expires_at: string
  views: number
  max_views: number
  full_short: string
}

export const metadata = {
  title: 'Minify - Dashbord',
  description: 'User can edit there minified urls',
}

const Dashboard: FC<DashboardProps> = async () => {
  let urls: UrlType[] = []

  try {
    const cookieString = cookies()
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join(';')

    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieString,
      },
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/url`,
      headers,
    )

    if (res.ok) {
      const { data } = await res.json()
      urls = (data.urls as UrlType[])
        .map(url => {
          return {
            ...url,
            full_short: `${process.env.NEXT_PUBLIC_BASE_URL}/url/${url.short_url}`,
          }
        })
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error)
  }

  return (
    <main className='mx-auto min-h-[calc(100vh-79px)] max-w-[1440px] px-6 py-4'>
      <UrlList urls={urls} />
    </main>
  )
}

export default Dashboard
