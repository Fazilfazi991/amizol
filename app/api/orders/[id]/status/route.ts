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
        user_id: '0abBmDLF2W7AYEvOm',     // Public Key
        accessToken: 'jMsAQJjx7zYJSwHoxBgH', // Private Key
        template_params: {
          // Standard EmailJS routing fields — MUST match template variable names
          to_email: order.customer_email,
          to_name: order.customer_name || 'Customer',
          reply_to: order.customer_email,
          // Additional order details for the template body
          customer_email: order.customer_email,
          customer_name: order.customer_name || 'Customer',
          order_id: order.id,
          order_status: 'Confirmed',
          total_price: `AED ${Number(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          customer_address: order.customer_address || 'N/A',
          order_items: Array.isArray(order.order_items)
            ? order.order_items.map((i: any) => `${i.name} (Size: ${i.size || 'N/A'}) - ${i.price}`).join('\n')
            : 'See order details',
        }
      };

      try {
        console.log('Sending EmailJS to:', order.customer_email, '| Template:', emailParams.template_id);
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailParams)
        });

        const responseText = await response.text();
        if (response.ok) {
          console.log(`✅ EmailJS sent to ${order.customer_email} — Response: ${responseText}`);
        } else {
          console.error(`❌ EmailJS failed (${response.status}): ${responseText}`);
          console.error('Params sent:', JSON.stringify(emailParams, null, 2));
        }
      } catch (emailError) {
        console.error('❌ Error calling EmailJS:', emailError);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
