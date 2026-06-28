import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/saved/investors - Get user's saved investors
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
      .from('saved_investors')
      .select(`
        id,
        created_at,
        investor:investors (
          id,
          slug,
          name,
          type,
          logo_url,
          stage_focus,
          sector_focus,
          portfolio_count,
          aum
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved investors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch saved investors' },
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

// POST /api/saved/investors - Save an investor
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
    const { investor_id } = body;

    if (!investor_id) {
      return NextResponse.json(
        { error: 'investor_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('saved_investors')
      .insert({
        user_id: session.user.id,
        investor_id,
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate save attempt
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Investor already saved' },
          { status: 200 }
        );
      }
      
      console.error('Error saving investor:', error);
      return NextResponse.json(
        { error: 'Failed to save investor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Investor saved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/saved/investors?investor_id=xxx - Unsave an investor
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
    const investor_id = searchParams.get('investor_id');

    if (!investor_id) {
      return NextResponse.json(
        { error: 'investor_id is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('saved_investors')
      .delete()
      .eq('user_id', session.user.id)
      .eq('investor_id', investor_id);

    if (error) {
      console.error('Error unsaving investor:', error);
      return NextResponse.json(
        { error: 'Failed to unsave investor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Investor unsaved successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
