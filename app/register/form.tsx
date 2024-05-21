'use client'

import { FC } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

type FormProps = {}

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(250, { message: "Name can't be longer then 250 characters long" }),
  email: z.string().email({ message: 'Pleas provide a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

const RegisterForm: FC<FormProps> = ({}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const submitPromise = new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
            {
              method: 'POST',
              body: JSON.stringify(values),
            },
          )

          if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData.error)
            reject(errorData.error);
            return;
          }

          const credentials = {
            email: values.email,
            password: values.password
          }

          const resSignIn = await signIn("credentials", { ...credentials, redirect: false });

          resolve(true);

          if (!resSignIn?.error) {
            router.push("/");
            router.refresh();
          }

        } catch (error: unknown) {
          if (error instanceof Error) {
            reject(error)
          }
        }
    })

    toast.promise(submitPromise, {
        loading: `Creating account for ${values.name}`,
        success: `${values.name} your account is created`,
        error: (error: Error) => error.message || "Failed to create new account"
    })
  }

  return (
    <Form {...form}>
      <form
        autoComplete='off'
        className='flex flex-col gap-2'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input tabIndex={1} autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input tabIndex={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  tabIndex={3}
                  type='password'
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={!form.formState.isValid}
          tabIndex={4}
          className='mt-4 w-full'
          type='submit'
        >
          Create Account
        </Button>
      </form>
    </Form>
  )
}

export default RegisterForm
