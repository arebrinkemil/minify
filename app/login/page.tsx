import { FC } from 'react';
import { getServerSession } from "next-auth";
import LoginForm from '@/components/made/LoginForm';
import { redirect } from 'next/navigation';
import authOptions from '../api/auth/[...nextauth]/auth';

type LoginProps = {};

const Login: FC<LoginProps> = async ({}) => {
  const session = await getServerSession(authOptions);

  if (session) redirect("/")
  
  return <LoginForm />
};

export default Login;