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

    // Fetch investor
    const { data: investor, error: investorError } = await supabase
      .from('investors')
      .select('*')
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

    // Fetch recent investments with company details
    const { data: investments } = await supabase
      .from('investments')
      .select(`
        *,
        company:companies(id, slug, name, logo_url, category, stage, valuation),
        funding_round:funding_rounds(round_type, amount, announced_date)
      `)
      .eq('investor_id', investor.id)
      .order('investment_date', { ascending: false })
      .limit(20);

    // Combine data
    const result = {
      ...investor,
      recent_investments: investments || [],
    };

    return NextResponse.json({
      data: result,
      meta: null,
      error: null,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/investors/[slug]:', error);
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
