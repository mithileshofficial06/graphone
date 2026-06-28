import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { rateLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimiter.check(clientIp);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { data: null, error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }

    // Fetch founder with linked company details
    const { data, error } = await supabase
      .from('founders')
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
          valuation,
          is_unicorn,
          founded_year,
          employee_count,
          website_url
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { 
          data: null, 
          error: {
            code: 'NOT_FOUND',
            message: `Founder with id '${id}' not found`
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
    console.error('Unexpected error in GET /api/founders/[id]:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
