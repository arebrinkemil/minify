import { NextRequest, NextResponse } from 'next/server'
import { createClient, sql } from '@vercel/postgres'
import { z } from 'zod'
import { DBUrlRow } from '@/types/types'
import { updateUrlSchema } from './schema'

type ApiResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: Error
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
      const error = new Error('No URL found for this short URL')
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error },
        { status: 404 },
      )
    }

    const urls: DBUrlRow[] = result.rows
    return NextResponse.json<ApiResponse<DBUrlRow[]>>({
      success: true,
      data: urls,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error },
        { status: 500 },
      )
    }
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: new Error('Internal server error') },
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
        { success: false, error: new Error('User ID is required') },
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
        { success: false, error: new Error('No URL found for this user') },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<DBUrlRow>>({
      success: true,
      data: result.rows[0],
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error },
        { status: 500 },
      )
    }
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: new Error('Internal server error') },
      { status: 500 },
    )
  } finally {
    await client.end()
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const client = createClient()
  try {
    await client.connect()

    let body = (await req.json()) as z.infer<typeof updateUrlSchema>

    if (body.expires_at) {
      body.expires_at = new Date(body.expires_at)
    }

    console.log(updateUrlSchema.safeParse(body).error)

    if (!updateUrlSchema.safeParse(body).success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: new Error('Invalid data') },
        { status: 403 },
      )
    }

    const { user_id, original_url, expires_at, max_views, short_url } = body

    const updateQuery = await sql`
      UPDATE urls SET
      user_id = ${user_id},
      original_url = ${original_url},
      expires_at = ${expires_at?.toISOString()},
      max_views =  ${max_views},
      short_url = ${short_url}
      WHERE short_url = ${short_url} RETURNING *;
    `

    const updateResult = updateQuery.rows[0] as DBUrlRow

    console.log(updateResult)

    if (!updateResult) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: new Error("This url doesn't exists") },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<DBUrlRow>>({
      success: true,
      data: updateResult,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error },
        { status: 500 },
      )
    }
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: new Error('Internal server error') },
      { status: 500 },
    )
  } finally {
    await client.end()
  }
}
