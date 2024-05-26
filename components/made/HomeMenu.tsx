'use client'

import { useState } from 'react'
import UrlForm, { ResponseDataType, formSchema } from './UrlForm'
import ClipbordCopy from './ClipbordCopy'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'

const HomeMenu = () => {
  const [url, setUrl] = useState('')
  const session = useSession()

  const handleSubmit = (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>, any, undefined>,
  ) => {
    const submitPromise = new Promise(async (resolve, reject) => {
      try {
        const { url, expires, maxAmount } = values

        const req: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            original_url: url,
            expires_at: expires || null,
            max_views: maxAmount ? parseInt(maxAmount) : null,
            user_id: session.data?.user.id || null,
          }),
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/url`,
          req,
        )

        if (!res.ok) {
          reject(new Error('Failed to add new url, please try again.'))
          return
        }

        const data = (await res.json()) as ResponseDataType

        if (!data.success) {
          reject(data.error)
          return
        }

        const { short_url } = data.data

        setUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/url/${short_url}`)

        form.reset()
        resolve(res.ok)
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error)
        }

        reject({ message: 'Error creating url' })
      }
    })

    toast.promise(submitPromise, {
      loading: 'Creatin new url',
      success: 'Url created successfully',
      error: (error: Error) => error.message,
    })
  }

  return (
    <>
      {url.length > 0 && <ClipbordCopy url={url} />}
      <UrlForm onSubmit={handleSubmit} />
    </>
  )
}

export default HomeMenu
