'use client'

import { ChangeEvent, FC, useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { UseFormReturn, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon, Info } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { HoverCard } from '@radix-ui/react-hover-card'
import { HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { DBUrlRow } from '@/types/types'
import { toast } from 'sonner'
import QRCodeDialog from './QrCode'
const date = new Date()
date.setHours(0, 0, 0, 0)

export const formSchema = z.object({
  url: z.string().url({ message: 'Invalid url' }),
  expires: z
    .date()
    .min(date, {
      message: `Expiration date can't be less then ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    })
    .optional(),
  maxAmount: z
    .string()
    .refine(v => {
      if (v?.length === 0) return true

      let number = Number(v)
      return !isNaN(number) && number >= 1
    })
    .optional(),
  shortUrl: z.string().optional(),
  views: z.string().optional(),
})

export type ResponseDataType =
  | {
      success: true
      data: DBUrlRow
    }
  | {
      success: false
      error: Error
    }

type UrlFormProps = {
  initialValue?: z.infer<typeof formSchema>
  onSubmit: (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>, any, undefined>,
  ) => void
  showViews?: boolean
}

const defaultValues: z.infer<typeof formSchema> = {
  url: '',
  expires: undefined,
  maxAmount: '',
  shortUrl: '',
  views: '',
}

const UrlForm: FC<UrlFormProps> = ({ initialValue, onSubmit }) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue ?? defaultValues,
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialValue?.expires,
  )

  const [views, setViews] = useState(0)

  useEffect(() => {
    if (!initialValue) return

    form.reset()

    form.setValue('url', initialValue.url)
    form.setValue('expires', initialValue.expires)
    form.setValue('maxAmount', initialValue.maxAmount)
    form.setValue('shortUrl', initialValue.shortUrl)
    form.setValue('views', initialValue.views)
    setSelectedDate(initialValue.expires)
  }, [initialValue, form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values, form)
  }

  const isShortUrlTaken = async (short: string) => {
    if (short.length === 0 || short === initialValue?.shortUrl) {
      form.clearErrors('shortUrl')
      return
    }

    form.trigger('shortUrl')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/url/${short}`,
        { cache: 'no-store' },
      )

      if (res.status === 200) {
        console.log(await res.json(), short)
        form.setError('shortUrl', {
          message: `${short} is alredy taken as a short path.`,
        })
      } else {
        form.clearErrors('shortUrl')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Error validating that your short url is uniqe')
      }
    }
  }

  const handleShortUrlChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (timer) clearTimeout(timer)

    const { value } = ev.target
    const shortPath = value.trim().replace(' ', '-')
    form.setValue('shortUrl', shortPath)

    setTimer(setTimeout(() => isShortUrlTaken(shortPath), 300))
  }

  const clearDate = () => {
    form.setValue('expires', undefined)
    setSelectedDate(undefined)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        autoComplete='off'
        className='grid grid-cols-1 gap-4 sm:grid-cols-2'
      >
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem className='sm:col-span-2'>
              <FormLabel className='flex w-full justify-start'>
                Original url
              </FormLabel>
              <FormControl>
                <Input
                  tabIndex={1}
                  {...field}
                  placeholder='https://www.google.com'
                />
              </FormControl>
              <FormMessage className='text-start' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='shortUrl'
          render={({ field: { onChange, ...rest } }) => (
            <FormItem className='sm:col-span-2'>
              <FormLabel className='flex w-full flex-grow items-center justify-between'>
                Custom short url (optional)
                <HoverCard>
                  <HoverCardTrigger className='cursor-pointer'>
                    <Info size={16} />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    This field can be left empty and we will generate a path for
                    you
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input
                  tabIndex={2}
                  {...rest}
                  onChange={handleShortUrlChange}
                  placeholder='minify'
                />
              </FormControl>
              <FormMessage className='text-start' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='expires'
          render={({ field }) => (
            <FormItem className='md:cols-span-1 col-span-2 flex flex-col'>
              <FormLabel className='flex w-full flex-grow items-center justify-between'>
                Expires (optional)
                <HoverCard>
                  <HoverCardTrigger className='cursor-pointer'>
                    <Info size={16} />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Expiration date for when the url will no longer work
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <div className='flex items-center'>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        tabIndex={2}
                        variant={'outline'}
                        className={cn(
                          'flex-1 pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={selectedDate}
                      onSelect={date => {
                        field.onChange(date)
                        setSelectedDate(date)
                      }}
                      disabled={date => {
                        const tomorrow = new Date()
                        tomorrow.setDate(tomorrow.getDate() - 1)
                        return date < tomorrow
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {selectedDate && (
                  <Button
                    variant='outline'
                    onClick={clearDate}
                    className='ml-2'
                  >
                    Clear Date
                  </Button>
                )}
              </div>
              <FormMessage className='text-start' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='maxAmount'
          render={({ field }) => (
            <FormItem className='md:cols-span-1 col-span-2'>
              <FormLabel className='flex w-full flex-grow items-center justify-between'>
                Max views (optional)
                <HoverCard>
                  <HoverCardTrigger className='cursor-pointer'>
                    <Info size={16} />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Set the maximum views allowed for this URL before it is
                    disabled.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  tabIndex={4}
                  placeholder='500'
                  type='number'
                  min={1}
                />
              </FormControl>
              <FormMessage className='text-start' />
            </FormItem>
          )}
        />

        <div className='col-span-2 grid gap-4 md:grid-cols-2'>
          <Button type='submit' disabled={!form.formState.isValid}>
            {!initialValue ? 'Create' : 'Save'}
          </Button>
          <div>
            {initialValue ? <QRCodeDialog url={initialValue.url} /> : null}
          </div>
        </div>

      </form>
    </Form>
  )
}

export default UrlForm
