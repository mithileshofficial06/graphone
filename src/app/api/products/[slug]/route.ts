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

    // Fetch product with company info
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        company:companies(
          id,
          slug,
          name,
          logo_url,
          tagline,
          category,
          stage,
          website_url
        )
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { 
          data: null, 
          error: {
            code: 'NOT_FOUND',
            message: `Product with slug '${slug}' not found`
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data,
      meta: null,
      error: null,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/products/[slug]:', error);
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
