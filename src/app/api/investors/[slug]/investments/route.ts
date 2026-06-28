import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { rateLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // First, get investor ID from slug
    const { data: investor, error: investorError } = await supabase
      .from('investors')
      .select('id')
      .eq('slug', slug)
      .single();

    if (investorError || !investor) {
      return NextResponse.json(
        { 
          data: null, 
          error: {
            code: 'NOT_FOUND',
            message: `Investor with slug '${slug}' not found`
          }
        },
        { status: 404 }
      );
    }

    // Fetch paginated investment history with company details
    const { data, error, count } = await supabase
      .from('investments')
      .select(`
        *,
        company:companies(id, slug, name, logo_url, category, stage),
        funding_round:funding_rounds(round_type, amount)
      `, { count: 'exact' })
      .eq('investor_id', investor.id)
      .order('investment_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching investments:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch investments' },
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
    console.error('Unexpected error in GET /api/investors/[slug]/investments:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
