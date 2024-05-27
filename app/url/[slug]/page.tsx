import { FC } from 'react'
import ClientComponent from './ClientComponent'

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
  let url = ''
  let errorMessage = ''
  let notFound = false

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/url/${params.slug}`,
      { cache: 'no-store' },
    )

    if (res.status === 404) {
      notFound = true
    } else if (!res.ok) {
      errorMessage = 'Error fetching url'
    } else {
      const data = (await res.json()) as DataType

      if (!data.success) {
        errorMessage = data.error.message
      } else {
        url = data.data.original_url
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage = error.message
    } else {
      errorMessage = 'Error fetching url'
    }
  }

  return (
    <ClientComponent
      url={url}
      errorMessage={errorMessage}
      notFound={notFound}
    />
  )
}

export default Page
