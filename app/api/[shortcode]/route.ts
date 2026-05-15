'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { shortenedLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  try {
    const { shortcode } = await params;

    if (!shortcode) {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      );
    }

    // Query the database for the shortened link
    const link = await db
      .select()
      .from(shortenedLinks)
      .where(eq(shortenedLinks.shortCode, shortcode))
      .limit(1);

    if (!link || link.length === 0) {
      return NextResponse.json(
        { error: 'Short link not found' },
        { status: 404 }
      );
    }

    const originalUrl = link[0].originalUrl;

    // Ensure the URL has a protocol
    const urlToRedirect = originalUrl.startsWith('http://') || originalUrl.startsWith('https://')
      ? originalUrl
      : `https://${originalUrl}`;

    // Redirect to the original URL
    return NextResponse.redirect(urlToRedirect, { status: 301 });
  } catch (error) {
    console.error('Error processing redirect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
