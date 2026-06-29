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
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { data: null, error: 'Search query parameter "q" is required' },
        { status: 400 }
      );
    }

    const searchTerm = `%${query.trim()}%`;

    // Search companies
    const { data: companies } = await supabase
      .from('companies')
      .select('id, slug, name, tagline, logo_url, category, stage')
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},tagline.ilike.${searchTerm}`)
      .limit(10);

    // Search investors
    const { data: investors } = await supabase
      .from('investors')
      .select('id, slug, name, logo_url, type, investment_thesis')
      .or(`name.ilike.${searchTerm},investment_thesis.ilike.${searchTerm}`)
      .limit(10);

    // Search products
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        description,
        category,
        upvotes,
        company:companies(id, slug, name, logo_url)
      `)
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(10);

    return NextResponse.json({
      data: {
        companies: companies || [],
        investors: investors || [],
        products: products || [],
      },
      meta: {
        query: query.trim(),
        total: (companies?.length || 0) + (investors?.length || 0) + (products?.length || 0),
      },
      error: null,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/search:', error);
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
