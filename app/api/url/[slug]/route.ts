
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@vercel/postgres";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const client = createClient();
  const slug = params.slug;

  try {
    await client.connect();

    const query = 'SELECT original_url FROM urls WHERE short_url = $1;';
    const values = [slug];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'URL not found' }, { status: 404 });
    }

    const original_url = result.rows[0].original_url;
    return NextResponse.json({ success: true, data: { original_url } });
    

  } catch (error) {
    console.error('Error fetching URL:', error);
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    await client.end();
  }
}
