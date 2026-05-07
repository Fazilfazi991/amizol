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

      // Build a plain-text items list (REST API doesn't support Handlebars loops)
      const itemsList = Array.isArray(order.order_items)
        ? order.order_items.map((i: any) =>
            `• ${i.name}${i.size ? ` (Size: ${i.size})` : ''} — AED ${i.price}`
          ).join('\n')
        : 'See order for details';

      const emailParams = {
        service_id: 'service_nymzmv6',
        template_id: 'template_4ja34sn',
        user_id: '0abBmDLF2W7AYEvOm',
        accessToken: 'jMsAQJjx7zYJSwHoxBgH',
        template_params: {
          // ---- Routing (must match "To Email" field in EmailJS template) ----
          email: order.customer_email,
          // ---- Body variables (must match {{variable}} names in template) ----
          order_id: order.id,
          customer_name: order.customer_name || 'Valued Customer',
          customer_address: order.customer_address || 'N/A',
          // Replace Handlebars loop with pre-formatted string
          orders: itemsList,
          // cost.shipping variable the template references
          'cost.shipping': 'FREE',
          total_price: `AED ${Number(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        }
      };

      try {
        console.log('📧 Sending EmailJS confirmation to:', order.customer_email);
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailParams)
        });

        const responseText = await response.text();
        if (response.ok) {
          console.log(`✅ Email sent to ${order.customer_email} — ${responseText}`);
        } else {
          console.error(`❌ EmailJS error (${response.status}): ${responseText}`);
        }
      } catch (emailError) {
        console.error('❌ EmailJS call failed:', emailError);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
