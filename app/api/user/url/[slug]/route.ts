import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@vercel/postgres'
import { getToken } from 'next-auth/jwt'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const client = createClient()
  const slug = params.slug

  try {
    const shortUrl = params.slug

    console.log('Fetching URL:', shortUrl)

    await client.connect()

    const query =
      'SELECT original_url, short_url, created_at, expires_at, views, max_views FROM urls WHERE short_url = $1;'
    const values = [shortUrl]

    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No URL found for this short URL' },
        { status: 404 },
      )
    }

    const urls = result.rows
    return NextResponse.json({ success: true, data: { urls } })
  } catch (error) {
    console.error('Error fetching URL:', error)
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const client = createClient()

  try {
    const body = await req.json()
    const userId = body.user_id
    const shortUrl = params.slug

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 },
      )
    }

    await client.connect()

    console.log('Deleting URL:', shortUrl, 'for user:', userId)

    const query =
      'DELETE FROM urls WHERE user_id = $1 AND short_url = $2 RETURNING *;'
    const values = [userId, shortUrl]

    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No URL found for this user' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: { url: result.rows[0] } })
  } catch (error) {
    console.error('Error deleting URL:', error)
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const client = createClient()

  try {
    const body = await req.json()
    const userId = body.user_id
    const shortUrl = params.slug

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 },
      )
    }

    await client.connect()

    console.log('Updating URL:', shortUrl, 'for user:', userId)

    const query =
      'UPDATE urls SET expires_at = $1, max_views = $2 WHERE user_id = $3 AND short_url = $4 RETURNING *;'
    const values = [body.expires_at, body.max_views, userId, shortUrl]

    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No URL found for this user' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: { url: result.rows[0] } })
  } catch (error) {
    console.error('Error updating URL:', error)
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
