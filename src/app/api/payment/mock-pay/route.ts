import { NextResponse } from 'next/server';
import { getOrder, updateOrderStatusToPaid, generateDownloadUrl } from '@/lib/supabaseServer';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'ไม่พบรหัสคำสั่งซื้อ' }, { status: 400 });
    }

    const currentOrder = await getOrder(order_id);
    if (!currentOrder) {
      return NextResponse.json({ error: 'ไม่พบคำสั่งซื้อในระบบ' }, { status: 404 });
    }

    // Update status to PAID
    const updatedOrder = await updateOrderStatusToPaid(order_id);
    if (!updatedOrder) {
      return NextResponse.json({ error: 'ไม่สามารถอัปเดตสถานะคำสั่งซื้อได้' }, { status: 500 });
    }

    // Generate Temporary Download URL
    const downloadUrl = await generateDownloadUrl(
      updatedOrder.book?.file_path || 'sample-ebook.pdf',
      updatedOrder.id
    );

    // Send confirmation email
    const emailResult = await sendOrderConfirmationEmail({
      to: updatedOrder.customer_email,
      customerName: updatedOrder.customer_name,
      orderId: updatedOrder.id,
      bookTitle: updatedOrder.book?.title || 'E-book',
      amount: updatedOrder.amount,
      downloadUrl,
    });

    return NextResponse.json({
      success: true,
      order_id: updatedOrder.id,
      status: updatedOrder.status,
      download_url: downloadUrl,
      email_sent: emailResult.success,
      email_simulated: emailResult.simulated,
      message: 'จำลองการชำระเงินสำเร็จ (DEMO PAID)',
    });
  } catch (error: unknown) {
    console.error('API /api/payment/mock-pay error:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
