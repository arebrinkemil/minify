'use client'

import { FC, useEffect } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { z } from 'zod'
import { UseFormReturn, useForm } from 'react-hook-form'
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
import { UrlType } from '@/app/dashboard/page'
import { DBUrlRow } from '@/types/types'

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
}

const defaultValues = {
  url: '',
  expires: undefined,
  maxAmount: '',
}

const UrlForm: FC<UrlFormProps> = ({ initialValue, onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue ?? defaultValues,
  })

  useEffect(() => {
    if (!initialValue) return

    form.setValue('url', initialValue.url)
    form.setValue('expires', initialValue.expires)
    form.setValue('maxAmount', initialValue.maxAmount)
  }, [initialValue])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values, form)
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
          {!initialValue ? 'Create' : 'Save'}
        </Button>
      </form>
    </Form>
  )
}

export default UrlForm
