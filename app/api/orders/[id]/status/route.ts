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
      // Dynamic import to avoid edge runtime issues if any
      const emailjs = require('@emailjs/nodejs');

      // Build orders array to perfectly match {{#orders}}...{{/orders}} in the template
      const ordersArray = Array.isArray(order.order_items)
        ? order.order_items.map((i: any) => ({
            name: i.name || 'Item',
            units: i.quantity || i.qty || 1,
            price: Number(i.price || 0).toFixed(2),
            image_url: i.image || i.image_url || 'https://www.thelittledubai.com/images/logo.png',
          }))
        : [{ name: 'Order items', units: 1, price: Number(order.total_price).toFixed(2), image_url: 'https://www.thelittledubai.com/images/logo.png' }];

      const templateParams = {
        email: order.customer_email,
        order_id: order.id,
        customer_name: order.customer_name || 'Valued Customer',
        customer_address: order.customer_address || 'N/A',
        orders: ordersArray,
        cost: {
          shipping: '0.00',
          tax: '0.00',
          total: Number(order.total_price).toFixed(2),
        }
      };

      try {
        console.log('📧 Sending EmailJS (SDK) to:', order.customer_email);
        
        const response = await emailjs.send(
          'service_nymzmv6',
          'template_4ja34sn',
          templateParams,
          {
            publicKey: '0abBmDLF2W7AYEvOm',
            privateKey: 'jMsAQJjx7zYJSwHoxBgH-',
          }
        );

        console.log(`✅ Email sent to ${order.customer_email} — Status: ${response.status} ${response.text}`);
      } catch (emailError: any) {
        console.error('❌ EmailJS SDK call failed:', emailError);
        if (emailError.status) {
          console.error('EmailJS Status:', emailError.status, 'Text:', emailError.text);
        }
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
