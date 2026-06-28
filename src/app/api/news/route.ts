import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { rateLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimiter.check(clientIp);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { data: null, error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' });

    // Apply tag filter
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // Sort by published date and apply pagination
    query = query
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch news' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      meta: {
        total: count || 0,
        page,
        limit,
      },
      error: null,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/news:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
