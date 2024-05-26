import { redirect } from 'next/navigation'
import { FC } from 'react'
import { toast } from 'sonner'

type PageProps = {
  params: {
    slug: string
  }
}
type DataType =
  | {
      success: true
      data: {
        original_url: string
      }
    }
  | {
      success: false
      error: Error
    }

const Page: FC<PageProps> = async ({ params }) => {
  let url

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/url/${params.slug}`,
      { cache: 'no-store' },
    )

    if (!res.ok) {
      toast.error('Error fetching url')
    } else {
      const data = (await res.json()) as DataType

      if (!data.success) {
        toast.error(data.error.message)
      } else {
        url = data.data.original_url
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error('Error fetching url')
    }
  }

  if (url) redirect(url)

  return (
    <div className='flex h-screen items-center justify-center text-black'>
      Redirecting...
    </div>
  )
}

export default Page
