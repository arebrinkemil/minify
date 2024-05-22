// middleware/authMiddleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const body = await req.json()

    if (req.nextauth.token && body.id) {
      console.log('Middleware was called: User authenticated')
      const { sub } = req.nextauth.token

      if (sub === body.id) {
        console.log('Middleware was called: User ID matches')
        return NextResponse.next()
      } else {
        console.log('Middleware was called: User ID does not match')
        return new NextResponse('Forbidden', { status: 403 })
      }
    } else {
      console.log('Middleware was called: User not authenticated')
      return new NextResponse('Unauthorized', { status: 401 })
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = { matcher: '/api/user/:path*' }
