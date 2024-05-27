'use client'

import { FC, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type ClientComponentProps = {
  url: string
  errorMessage: string
  notFound: boolean
}

const ClientComponent: FC<ClientComponentProps> = ({
  url,
  errorMessage,
  notFound,
}) => {
  const router = useRouter()

  useEffect(() => {
    if (notFound) {
      console.log('URL not found or expired')
    } else if (errorMessage) {
      toast.error(errorMessage)
    } else if (url) {
      router.push(url)
    }
  }, [url, errorMessage, notFound, router])

  if (notFound) {
    return (
      <div className='flex h-screen flex-col items-center justify-center text-black'>
        <h2>URL not found or expired</h2>
        <div>
          <button
            className='bg-button mt-4 rounded px-4 py-2 text-white'
            onClick={() => router.push('/')}
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen items-center justify-center text-black'>
      Redirecting...
    </div>
  )
}

export default ClientComponent
