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
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

type FormProps = {}

const formSchema = z.object({
  email: z.string().email({ message: 'Pleas provide a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

const LoginForm: FC<FormProps> = ({}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const submitPromise = new Promise(async (resolve, reject) => {
        try {
          const credentials = {
            email: values.email,
            password: values.password
          }

          const resSignIn = await signIn("credentials", { ...credentials, redirect: false });

          
          if (resSignIn?.error) {
            if (resSignIn.error === "CredentialsSignin") {
             const newError: Error = {
                name: "CredentialsSignin",
                message: "Invalid credentials"
              }

              reject(newError)
              return;
            }

            reject(resSignIn.error)
            return
          }


          resolve(true);
          router.push(callbackUrl || "/");
          router.refresh();
        } catch (error: unknown) {
          if (error instanceof Error) {
            reject(error)
          }
        }
    })

    toast.promise(submitPromise, {
        loading: `Signing in ${values.email}`,
        success: "Login successful",
        error: (error: Error) => error.message || "Failed signin, please try again"
    })
  }

  return (

    <Form {...form}>
      <form
        className='flex flex-col gap-2'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input tabIndex={2} autoFocus autoComplete='email' {...field} />
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
                  autoComplete='current-password'
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
          Login
        </Button>
      </form>
    </Form>

  )
}

export default LoginForm
