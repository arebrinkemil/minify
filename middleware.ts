// middleware/authMiddleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    if (req.method === 'POST') {
      const body = await req.json()

      if (req.nextauth.token && body.user_id) {
        console.log('Middleware was called: User authenticated')
        const { sub } = req.nextauth.token

        if (sub && sub === body.user_id) {
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
    } else {
      if (req.nextauth.token) {
        console.log('Middleware was called: User authenticated')
        const { sub } = req.nextauth.token
        if (sub) {
          req.headers.set('x-user-id', sub)
        }
        return NextResponse.next()
      } else {
        console.log('Middleware was called: User not authenticated')
        return new NextResponse('Unauthorized', { status: 401 })
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = { matcher: '/api/user/:path*' }
