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

    // Fetch company with all relations
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
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

    // Fetch founders
    const { data: founders } = await supabase
      .from('founders')
      .select('*')
      .eq('company_id', company.id);

    // Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', company.id)
      .order('upvotes', { ascending: false });

    // Fetch funding rounds with lead investor details
    const { data: fundingRounds } = await supabase
      .from('funding_rounds')
      .select(`
        *,
        lead_investor:investors(id, name, slug, logo_url, type)
      `)
      .eq('company_id', company.id)
      .order('announced_date', { ascending: false });

    // Fetch related news articles
    const { data: companyNews } = await supabase
      .from('company_news')
      .select(`
        news_article_id,
        news_articles(*)
      `)
      .eq('company_id', company.id);

    const newsArticles = companyNews?.map((cn: any) => cn.news_articles).filter(Boolean) || [];

    // Fetch investors through investments
    const { data: investments } = await supabase
      .from('investments')
      .select(`
        *,
        investor:investors(id, name, slug, logo_url, type)
      `)
      .eq('company_id', company.id);

    const investors = investments?.map((inv: any) => inv.investor).filter(Boolean) || [];

    // Combine all data
    const result = {
      ...company,
      founders: founders || [],
      products: products || [],
      funding_rounds: fundingRounds || [],
      news: newsArticles,
      investors: investors,
    };

    return NextResponse.json({
      data: result,
      meta: null,
      error: null,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/companies/[slug]:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
