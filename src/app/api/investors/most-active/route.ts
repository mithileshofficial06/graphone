import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cache } from '@/lib/cache';
import { rateLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/auth';

const CACHE_KEY = 'investors:most-active';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    // Check cache first
    const cached = cache.get<unknown>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .order('portfolio_count', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching most active investors:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch most active investors' },
        { status: 500 }
      );
    }

    const response = {
      data,
      meta: {
        total: data?.length || 0,
      },
      error: null,
    };

    // Cache the response
    cache.set(CACHE_KEY, response, CACHE_TTL);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in GET /api/investors/most-active:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
