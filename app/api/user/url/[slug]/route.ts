import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@vercel/postgres'

export async function GET(req: NextRequest) {
  const client = createClient()

  try {
    const body = await req.json()
    const userId = body.user_id

    await client.connect()

    const query =
      'SELECT original_url, short_url, created_at, expires_at, views, max_views FROM urls WHERE user_id = $1;'
    const values = [userId]

    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No URLs found for this user' },
        { status: 404 },
      )
    }

    const urls = result.rows
    return NextResponse.json({ success: true, data: { urls } })
  } catch (error) {
    console.error('Error fetching URLs:', error)
    let errorMessage = 'An error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    )
  } finally {
    await client.end()
  }
}
