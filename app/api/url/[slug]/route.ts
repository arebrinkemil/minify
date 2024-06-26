import { NextRequest, NextResponse } from 'next/server'
import { createClient, sql } from '@vercel/postgres'
import { DBUrlRow } from '@/types/types'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const client = createClient()
  const slug = params.slug

  try {
    await client.connect()

    const query = await client.query(
      'SELECT original_url, views, max_views, expires_at, user_id FROM urls WHERE short_url = $1',
      [slug],
    )

    if (!query.rows.length) {
      return NextResponse.json(
        { success: false, error: new Error('URL not found') },
        { status: 404 },
      )
    }

    const { original_url, views, max_views, expires_at, user_id } = query
      .rows[0] as DBUrlRow

    if (max_views && views >= max_views) {
      return NextResponse.json(
        {
          success: false,
          error: new Error('URL has reached maximun amount of visists.'),
        },
        { status: 404 },
      )
    }

    if (expires_at && new Date(expires_at) < new Date()) {
      if (!user_id) {
        await sql`
          DELETE FROM urls WHERE short_url = ${slug}
        `
      }

      return NextResponse.json(
        {
          success: false,
          error: new Error('Times up!'),
        },
        { status: 404 },
      )
    }

    sql`
      UPDATE urls SET
      views = views + 1
      WHERE  short_url = ${slug}; 
    `

    return NextResponse.json(
      {
        success: true,
        data: { original_url },
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error }, { status: 500 })
    }
    return NextResponse.json(
      { success: false, error: new Error('Internal server error') },
      { status: 500 },
    )
  } finally {
    await client.end()
  }
}
