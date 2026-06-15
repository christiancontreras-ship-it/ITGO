import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (category) query = query.eq('category', category);

    // Apply role-based filtering
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', payload.sub)
      .single();

    if (user?.role === 'client') {
      query = query.eq('client_id', payload.sub);
    } else if (user?.role === 'specialist') {
      query = query.or(`specialist_id.eq.${payload.sub},client_id.eq.${payload.sub}`);
    }

    // Pagination
    const offset = (page - 1) * pageSize;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    const { data: tickets, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      items: tickets,
      total: count || 0,
      page,
      page_size: pageSize,
      total_pages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error('Tickets GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, priority = 'medium' } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create ticket
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        client_id: payload.sub,
        title,
        description,
        category,
        priority,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Call AI classification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticket.id,
          title,
          description,
          category,
        }),
      });
    } catch (aiError) {
      console.error('AI classification error:', aiError);
    }

    // Create notification for admins
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin');

    if (admins) {
      await supabase.from('notifications').insert(
        admins.map((admin) => ({
          user_id: admin.id,
          type: 'ticket',
          title: 'Nuevo ticket',
          description: title,
          related_id: ticket.id,
        }))
      );
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Tickets POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
