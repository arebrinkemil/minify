"use client"

import { ChangeEvent, FC, FormEvent, FormHTMLAttributes, useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage  } from '../ui/form';
import { Input } from '../ui/input';

type LoginFormProps = FormHTMLAttributes<HTMLFormElement> & {};

const LoginForm: FC<LoginFormProps> = ({ ...props }) => {
    const [form, setForm] = useState({ email: "", password: ""})
    const router = useRouter()

    const handleChange = <T extends keyof typeof form>(prop: T, ev: ChangeEvent<HTMLInputElement>) => {
        const { value } = ev.target
        
        setForm(prev => ({ ...prev, [prop]: value }))
    }

    const handleSubmit = async (ev: FormEvent) => {
        ev.preventDefault();

        const res = await signIn("credentials", { ...form, redirect: false });

        if (!res?.error) {
          router.push("/");
          router.refresh();
        }
    }
    
  return (
    <div className="text-center mb-8">
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      Minify
    </h2>
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      Login
    </h4>

    <form {...props} className='text-black pt-16' onSubmit={handleSubmit}>
      <Input placeholder='Email' value={form.email} onChange={(ev) => handleChange("email", ev)} type="text" name='email' autoComplete='email' autoFocus className='mb-5'/>
      <Input placeholder='Password' value={form.password} onChange={(ev) => handleChange("password", ev)} type="password" name='password' autoComplete='current-password' className='mb-8'/>
      <Button type='submit' style={{width: '200px'}}>Login</Button>
    </form>
  </div>
  )
};

export default LoginForm;