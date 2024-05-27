import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(250, { message: "Name can't be longer then 250 characters long" }),
  email: z.string().email({ message: 'Pleas provide a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})
