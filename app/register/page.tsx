import { FC } from 'react'
import RegisterForm from './form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RegisterProps = {}

const Register: FC<RegisterProps> = ({}) => {
  return (
    <Card className='w-screen max-w-[450px]'>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  )
}

export default Register
