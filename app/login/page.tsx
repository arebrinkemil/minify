import { FC } from 'react';
import { getServerSession } from "next-auth";
import LoginForm from '@/components/made/LoginForm';
import { redirect } from 'next/navigation';

type LoginProps = {};

const Login: FC<LoginProps> = async ({}) => {
  const session = await getServerSession();

  if (session) redirect("/")
  
  return <LoginForm />
};

export default Login;