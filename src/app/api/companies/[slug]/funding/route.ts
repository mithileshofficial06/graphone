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

    // First, get company ID from slug
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', slug)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { 
          data: null, 
          error: {
            code: 'NOT_FOUND',
            message: `Company with slug '${slug}' not found`
          }
        },
        { status: 404 }
      );
    }

    // Fetch funding rounds with lead investor name
    const { data, error } = await supabase
      .from('funding_rounds')
      .select(`
        *,
        lead_investor:investors(id, name, slug, logo_url, type)
      `)
      .eq('company_id', company.id)
      .order('announced_date', { ascending: false });

    if (error) {
      console.error('Error fetching funding rounds:', error);
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch funding rounds' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      meta: {
        total: data?.length || 0,
      },
      error: null,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/companies/[slug]/funding:', error);
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
