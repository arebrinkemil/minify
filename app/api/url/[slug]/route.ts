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

    const query = await sql`
      SELECT  original_url, views, max_views
      FROM urls WHERE short_url = ${slug};
    `

    if (!query.rows.length) {
      return NextResponse.json(
        { success: false, error: new Error('URL not found') },
        { status: 404 },
      )
    }

    const { original_url, views, max_views } = query.rows[0] as DBUrlRow

    if (max_views && views + 1 >= max_views) {
      return NextResponse.json(
        {
          success: false,
          error: new Error('URL has reached maximun amount of visists.'),
        },
        { status: 403 },
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
