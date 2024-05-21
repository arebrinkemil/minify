"use client"

import { ChangeEvent, FC, FormEvent, FormHTMLAttributes, useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

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
    
  return <form {...props} className='text-black pt-16' onSubmit={handleSubmit}>
    <input placeholder='Email' value={form.email} onChange={(ev) => handleChange("email", ev)} type="text" name='email' autoComplete='email' autoFocus />
    <input placeholder='Password' value={form.password} onChange={(ev) => handleChange("password", ev)} type="password" name='password' autoComplete='current-password' />
    <button type='submit'>Login</button>
  </form>;
};

export default LoginForm;