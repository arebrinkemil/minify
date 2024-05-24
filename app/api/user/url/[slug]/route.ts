import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@vercel/postgres'

type Url = {
  original_url: string
  short_url: string
  created_at: Date
  expires_at: Date | null
  views: number
  max_views: number | null
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
): Promise<NextResponse> {
  const client = createClient()
  const slug = params.slug

  try {
    await client.connect()

    const query =
      'SELECT original_url, short_url, created_at, expires_at, views, max_views FROM urls WHERE short_url = $1;'
    const values = [slug]

    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No URL found for this short URL' },
        { status: 404 },
      )
    }

    const urls: Url[] = result.rows
    return NextResponse.json<ApiResponse<Url[]>>({ success: true, data: urls })
  } catch (error) {
    console.error('Error fetching URL:', error)
    let errorMessage = 'An error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json<ApiResponse<null>>(
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
): Promise<NextResponse> {
  const client = createClient()

  try {
    const body = await req.json()
    const userId = body.user_id
    const shortUrl = params.slug

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'User ID is required' },
        { status: 400 },
      )
    }

    await client.connect()

    const query =
      'DELETE FROM urls WHERE user_id = $1 AND short_url = $2 RETURNING *;'
    const values = [userId, shortUrl]

    const result = await client.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No URL found for this user' },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<Url>>({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Error deleting URL:', error)
    let errorMessage = 'An error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json<ApiResponse<null>>(
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
): Promise<NextResponse> {
  const client = createClient()

  try {
    const body = await req.json()
    const userId = body.user_id
    const shortUrl = params.slug

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'User ID is required' },
        { status: 400 },
      )
    }

    await client.connect()

    const fetchQuery =
      'SELECT expires_at, max_views FROM urls WHERE user_id = $1 AND short_url = $2;'
    const fetchValues = [userId, shortUrl]

    const fetchResult = await client.query(fetchQuery, fetchValues)

    if (fetchResult.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No URL found for this user' },
        { status: 404 },
      )
    }

    const existingUrl = fetchResult.rows[0]

    const newShortUrl = body.short_url ?? existingUrl.short_url
    const expiresAt = body.expires_at ?? existingUrl.expires_at
    const maxViews = body.max_views ?? existingUrl.max_views

    const updateQuery =
      'UPDATE urls SET expires_at = $1, max_views = $2, short_url = $3 WHERE user_id = $4 AND short_url = $5 RETURNING *;'
    const updateValues = [expiresAt, maxViews, newShortUrl, userId, shortUrl]

    const updateResult = await client.query(updateQuery, updateValues)

    if (updateResult.rows.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No URL found for this user' },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<Url>>({
      success: true,
      data: updateResult.rows[0],
    })
  } catch (error) {
    console.error('Error updating URL:', error)
    let errorMessage = 'An error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: errorMessage },
      { status: 500 },
    )
  } finally {
    await client.end()
  }
}
