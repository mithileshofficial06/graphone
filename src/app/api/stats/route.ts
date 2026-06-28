import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cache } from '@/lib/cache';
import { rateLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/auth';

const CACHE_KEY = 'stats:platform';
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

    // Fetch all stats in parallel
    const [
      companiesResult,
      investorsResult,
      productsResult,
      newsResult,
      fundingResult,
      unicornsResult,
    ] = await Promise.all([
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('investors').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('news_articles').select('*', { count: 'exact', head: true }),
      supabase.from('funding_rounds').select('amount'),
      supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_unicorn', true),
    ]);

    // Calculate total funding
    const totalFunding = fundingResult.data?.reduce(
      (sum: number, round: any) => sum + (round.amount || 0),
      0
    ) || 0;

    const stats = {
      total_companies: companiesResult.count || 0,
      total_investors: investorsResult.count || 0,
      total_products: productsResult.count || 0,
      total_news: newsResult.count || 0,
      total_funding: totalFunding,
      unicorn_count: unicornsResult.count || 0,
    };

    const response = {
      data: stats,
      meta: null,
      error: null,
    };

    // Cache the response
    cache.set(CACHE_KEY, response, CACHE_TTL);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in GET /api/stats:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
