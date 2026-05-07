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

    console.log(`🔔 Status route called — order: ${id}, new status: ${status}`);

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

    console.log(`✅ Order updated — email: ${order.customer_email || 'NONE'}, status: ${status}`);

    // Send email if status is Confirmed and email exists
    if (status === 'Confirmed' && order.customer_email) {

      // Build orders array to match {{#orders}}...{{/orders}} in the template
      const ordersArray = Array.isArray(order.order_items)
        ? order.order_items.map((i: any) => ({
            name: i.name || 'Item',
            units: i.quantity || i.qty || 1,
            price: Number(i.price || 0).toFixed(2),
            image_url: i.image || i.image_url || '',
          }))
        : [{ name: 'Order items', units: 1, price: Number(order.total_price).toFixed(2), image_url: '' }];

      const emailParams = {
        service_id: 'service_nymzmv6',
        template_id: 'template_4ja34sn',
        user_id: '0abBmDLF2W7AYEvOm',
        accessToken: 'jMsAQJjx7zYJSwHoxBgH',
        template_params: {
          // Routing — matches "To Email: {{email}}" in template settings
          email: order.customer_email,
          // Body variables — match template exactly
          order_id: order.id,
          orders: ordersArray,
          cost: {
            shipping: '0.00',
            tax: '0.00',
            total: Number(order.total_price).toFixed(2),
          },
        }
      };

      try {
        console.log('📧 Sending EmailJS to:', order.customer_email);
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
          console.error('Payload:', JSON.stringify(emailParams, null, 2));
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
