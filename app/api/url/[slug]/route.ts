import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@vercel/postgres";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
  ) {
    const slug = params.slug

    console.log(`Fetching URL with slug: ${slug}`);

    return new Response(`URL with slug: ${slug}`);
  }