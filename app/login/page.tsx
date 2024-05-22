import { FC } from 'react';
import { getServerSession } from "next-auth";
import LoginForm from '@/components/made/LoginForm';
import { redirect } from 'next/navigation';
import authOptions from '../api/auth/[...nextauth]/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type LoginProps = {};

const Login: FC<LoginProps> = async ({}) => {
  const session = await getServerSession(authOptions);

  if (session) redirect("/")
  
  return (
  <main className='h-screen flex justify-center items-center'>

      <Card className='w-screen max-w-[450px] mb-20'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
};

export default Login;