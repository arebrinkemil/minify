// components/HomeForm.tsx
'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const FormSchema = z.object({
  link: z.string().min(2, {
    message: 'Link must be at least 2 characters.',
  }),
  duration: z.string().min(1, {
    message: 'Duration is required.',
  }),
  clickAmount: z.string().min(1, {
    message: 'Clicks is required.',
  }),
})

interface HomeFormProps {
  onShortUrlGenerated: (shortUrl: string) => void
}

const HomeForm: React.FC<HomeFormProps> = ({ onShortUrlGenerated }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      link: '',
      duration: '',
      clickAmount: '',
    },
  })

  const session = useSession()

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch('/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_url: data.link,
          expires_at: calculateExpiryDate(data.duration),
          max_views: parseInt(data.clickAmount),
          user_id: session.data?.user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Response was not ok')
      }

      const result = await response.json()
      onShortUrlGenerated(result.data.short_url)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const calculateExpiryDate = (duration: string) => {
    const now = new Date()
    now.setHours(now.getHours() + parseInt(duration))
    return now.toISOString()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8 space-y-8'>
        <FormField
          control={form.control}
          name='link'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder='Paste your link here...' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='duration'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  name='duration'
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='How long should link be active?' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='24'>24 hours</SelectItem>
                        <SelectItem value='48'>48 hours</SelectItem>
                        <SelectItem value='200'>200 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='clickAmount'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  name='clickAmount'
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='How many max clicks?' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1'>1 click</SelectItem>
                        <SelectItem value='10'>10 clicks</SelectItem>
                        <SelectItem value='100'>100 clicks</SelectItem>
                        <SelectItem value='1000'>1000 clicks</SelectItem>
                        <SelectItem value='10000'>10 000 clicks</SelectItem>
                        <SelectItem value='99999999'>
                          Unlimited amount of clicks
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}

export default HomeForm
