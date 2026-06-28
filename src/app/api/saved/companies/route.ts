import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/saved/companies - Get user's saved companies
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('saved_companies')
      .select(`
        id,
        created_at,
        company:companies (
          id,
          slug,
          name,
          tagline,
          logo_url,
          category,
          stage,
          valuation,
          is_unicorn,
          growth_score
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved companies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch saved companies' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      meta: { total: data?.length || 0 },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/saved/companies - Save a company
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company_id } = body;

    if (!company_id) {
      return NextResponse.json(
        { error: 'company_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('saved_companies')
      .insert({
        user_id: session.user.id,
        company_id,
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate save attempt
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Company already saved' },
          { status: 200 }
        );
      }
      
      console.error('Error saving company:', error);
      return NextResponse.json(
        { error: 'Failed to save company' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Company saved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/saved/companies?company_id=xxx - Unsave a company
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');

    if (!company_id) {
      return NextResponse.json(
        { error: 'company_id is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('saved_companies')
      .delete()
      .eq('user_id', session.user.id)
      .eq('company_id', company_id);

    if (error) {
      console.error('Error unsaving company:', error);
      return NextResponse.json(
        { error: 'Failed to unsave company' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Company unsaved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
