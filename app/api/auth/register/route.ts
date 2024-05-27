import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import bcrypt from 'bcrypt'
import { registerSchema } from './schema'

type ExtendedErrorType = Error & {
  code?: string | number
}

export const POST = async (req: Request) => {
  try {
    const body: z.infer<typeof registerSchema> = await req.json()

    if (!registerSchema.safeParse(body).success) {
      return NextResponse.json(
        { success: false, error: new Error('Invalid data') },
        { status: 403 },
      )
    }

    const { name, email, password } = body

    const hashPass = await bcrypt.hash(password, 10)

    await sql`
            INSERT INTO users (name, email, password) 
            VALUES (${name}, ${email}, ${hashPass})
        `

    return NextResponse.json({
      success: true,
      data: { name, email },
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ((error as ExtendedErrorType).code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: {
              ...error,
              message: 'This account already exists',
            },
          },
          {
            status: 409,
          },
        )
      }
    }
    return NextResponse.json(
      { success: false, error: new Error('Internal server error') },
      { status: 500 },
    )
  }
}
