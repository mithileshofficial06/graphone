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
        { data: null, error: { code: 'RATE_LIMIT', message: 'Rate limit exceeded. Try again later.' } },
        { status: 429 }
      );
    }

    // Fetch founder
    const { data: founder, error: founderError } = await supabase
      .from('founders')
      .select('*, company:companies(id, name, slug, logo_url)')
      .eq('id', slug)
      .single();

    if (founderError || !founder) {
      return NextResponse.json(
        { 
          data: null, 
          error: {
            code: 'NOT_FOUND',
            message: `Founder with ID '${slug}' not found`
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: founder,
      meta: null,
      error: null,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/founders/[slug]:', error);
    return NextResponse.json(
      {
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        }
      },
      { status: 500 }
    );
  }
}
