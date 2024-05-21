import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  const client = createClient();

  try {
    await client.connect();
    
    const { original_url, short_url, expires_at } = await req.json();

    const query = `
      INSERT INTO urls (original_url, short_url, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [original_url, short_url, expires_at];

    const result = await client.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error('Error inserting URL:', error);
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    await client.end();
  }
}


export async function GET(req: NextRequest) {
  const client = createClient();

  try {
    await client.connect();

    const query = 'SELECT * FROM urls;';
    const result = await client.query(query);

    return NextResponse.json({ success: true, data: result.rows });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    await client.end();
  }
}