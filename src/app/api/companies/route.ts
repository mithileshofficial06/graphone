import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateApiKey, getClientIp } from '@/lib/auth';
import { rateLimiter } from '@/lib/rateLimit';
import { z } from 'zod';

// Validation schema for creating a company
const createCompanySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  category: z.string().min(1),
  founded_year: z.number().int().optional(),
  employee_count: z.number().int().optional(),
  headquarters: z.string().optional(),
  stage: z.string().min(1),
  valuation: z.number().optional(),
  is_unicorn: z.boolean().optional(),
});

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
    const category = searchParams.get('category');
    const stage = searchParams.get('stage');
    const country = searchParams.get('country');
    const sort = searchParams.get('sort') || 'trending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase.from('companies').select('*', { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (stage) {
      query = query.eq('stage', stage);
    }
    if (country) {
      query = query.ilike('headquarters', `%${country}%`);
    }

    // Apply sorting
    switch (sort) {
      case 'trending':
        query = query.order('growth_score', { ascending: false });
        break;
      case 'funded':
        query = query.order('valuation', { ascending: false, nullsFirst: false });
        break;
      case 'new':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('growth_score', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch companies' },
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
    console.error('Unexpected error in GET /api/companies:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
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

    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized. Valid X-API-Key header required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = createCompanySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          data: null, 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([validationResult.data])
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to create company' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data, meta: null, error: null },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/companies:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
