import { FC } from 'react'
import RegisterForm from './form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RegisterProps = {}

const Register: FC<RegisterProps> = ({}) => {
  return (
    <main className='h-screen flex justify-center items-center'>
      <Card className='w-screen max-w-[450px] mb-20'>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  )
}

export default Register
