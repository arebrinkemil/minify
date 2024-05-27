import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@vercel/postgres'
import { generateShortUrl } from '@/lib/urlUtils'
import { z } from 'zod'
import { updateUrlSchema } from './schema'

export async function POST(req: NextRequest) {
  const client = createClient()

  try {
    await client.connect()

    const genShortUrl = generateShortUrl()

    const body: z.infer<typeof updateUrlSchema> = await req.json()

    if (!updateUrlSchema.safeParse(body).success) {
      return NextResponse.json(
        { success: false, error: new Error('Invalid data') },
        { status: 403 },
      )
    }

    const { original_url, expires_at, max_views, user_id, short_url } = body

    const shortUrl = short_url && short_url.length > 0 ? short_url : genShortUrl

    const query = `
      INSERT INTO urls (original_url, short_url, expires_at, max_views, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `
    const values = [original_url, shortUrl, expires_at, max_views, user_id]

    const result = await client.query(query, values)

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error inserting URL:', error)
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

export async function GET(req: NextRequest) {
  const client = createClient()

  try {
    await client.connect()

    const query = 'SELECT * FROM urls;'
    const result = await client.query(query)

    return NextResponse.json({ success: true, data: result.rows })
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
