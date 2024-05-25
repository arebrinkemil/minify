import { Dispatch, FC, FormHTMLAttributes, SetStateAction } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon, Info } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { HoverCard } from '@radix-ui/react-hover-card'
import { HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

type DataType = {
  user_id: string | null
  original_url: string
  short_url: string
  created_at: string
  expires_at: string
  views: number
  max_views: number
}
type ResponseDataType =
  | {
      success: true
      data: DataType
    }
  | {
      success: false
      error: Error
    }
type UrlFormProps = {
  setValue: Dispatch<SetStateAction<string>>
}

const date = new Date()
date.setHours(0, 0, 0, 0)

const formSchema = z.object({
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
})

const UrlForm: FC<UrlFormProps> = ({ setValue }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      expires: undefined,
      maxAmount: '',
    },
  })
  const session = useSession()

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const submitPromise = new Promise(async (resolve, reject) => {
      const user = session.data?.user

      if (!user) {
        reject(new Error('Failed to get user session, please try again.'))
        return
      }

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
            user_id: user.id,
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

        setValue(`${process.env.NEXT_PUBLIC_BASE_URL}/url/${short_url}`)

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
          name='expires'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      tabIndex={2}
                      variant={'outline'}
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => {
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() - 1)
                      return date < tomorrow
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className='text-start' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='maxAmount'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex w-full flex-grow items-center justify-between'>
                Max clicks (optional)
                <HoverCard>
                  <HoverCardTrigger className='cursor-pointer'>
                    <Info size={16} />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Set the maximum clicks allowed for this URL before it is
                    disabled.
                  </HoverCardContent>
                </HoverCard>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  tabIndex={3}
                  placeholder='500'
                  type='number'
                  min={1}
                />
              </FormControl>
              <FormMessage className='text-start' />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='sm:col-span-2'
          disabled={!form.formState.isValid}
        >
          Create short url
        </Button>
      </form>
    </Form>
  )
}

export default UrlForm
