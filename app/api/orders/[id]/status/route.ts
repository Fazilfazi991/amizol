import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Provide a fallback or mock instance if API key is missing
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Update in Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email if status is Confirmed and email exists
    if (status === 'Confirmed' && order.customer_email) {
      const emailParams = {
        service_id: 'service_nymzmv6',
        template_id: 'template_4ja34sn',
        user_id: 'jMsAQJjx7zYJSwHoxBgH', // Public Key
        template_params: {
          customer_email: order.customer_email,
          customer_name: order.customer_name || 'Customer',
          order_id: order.id,
          total_price: Number(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          customer_address: order.customer_address
        }
      };

      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailParams)
        });

        if (response.ok) {
          console.log(`EmailJS: Email successfully sent to ${order.customer_email}`);
        } else {
          const errorText = await response.text();
          console.error('EmailJS Error:', errorText);
        }
      } catch (emailError) {
        console.error('Error sending email via EmailJS:', emailError);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
