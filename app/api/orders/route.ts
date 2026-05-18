import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mherqrjuoafvkbauvaob.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXJxcmp1b2FmdmtiYXV2YW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDkyMTAsImV4cCI6MjA5MjMyNTIxMH0.wypisj0nT9iw-PE6NU8FJU6GzeW2AXw7zrxM9BhrpKs'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      order_items,
      total_price,
      status,
    } = body;

    if (!customer_name || !customer_phone || !order_items || !total_price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          customer_name,
          customer_email: customer_email || null,
          customer_phone,
          customer_address,
          order_items,
          total_price,
          status: status || 'Pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: data }, { status: 201 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
