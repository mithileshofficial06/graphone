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
    const type = searchParams.get('type');
    const stage_focus = searchParams.get('stage_focus');
    const sector = searchParams.get('sector');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase.from('investors').select('*', { count: 'exact' });

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }
    if (stage_focus) {
      query = query.contains('stage_focus', [stage_focus]);
    }
    if (sector) {
      query = query.contains('sector_focus', [sector]);
    }

    // Apply sorting and pagination
    query = query
      .order('portfolio_count', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching investors:', error);
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch investors' } },
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
    console.error('Unexpected error in GET /api/investors:', error);
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
