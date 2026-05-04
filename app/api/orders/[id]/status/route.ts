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
      const emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h1 style="text-align: center; letter-spacing: 0.1em; text-transform: uppercase;">LITTLE DUBAI</h1>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h2>Order Confirmed!</h2>
          <p>Hi ${order.customer_name || 'Customer'},</p>
          <p>Great news! Your order has been confirmed by our team and is now being processed.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin: 0 0 10px 0;"><strong>Total Amount:</strong> AED ${Number(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p style="margin: 0;"><strong>Shipping to:</strong> ${order.customer_address}</p>
          </div>
          <p>We will notify you once your order is dispatched for delivery.</p>
          <br/>
          <p>Thank you for shopping with Little Dubai!</p>
        </div>
      `;

      if (resend) {
        try {
          await resend.emails.send({
            from: 'Little Dubai <orders@littledubai.com>', // Requires verified domain on Resend
            to: order.customer_email,
            subject: 'Your Little Dubai Order is Confirmed!',
            html: emailContent,
          });
          console.log(`Email sent to ${order.customer_email}`);
        } catch (emailError) {
          console.error('Error sending email via Resend:', emailError);
        }
      } else {
        console.warn(`[EMAIL MOCK] Resend API Key missing. Would have sent email to ${order.customer_email}`);
        console.log("[EMAIL CONTENT]:\n", emailContent);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
