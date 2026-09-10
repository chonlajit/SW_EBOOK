import { NextResponse } from 'next/server';
import { getOrder, generateDownloadUrl } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'ระบุ orderId' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'ไม่พบคำสั่งซื้อ' }, { status: 404 });
    }

    let downloadUrl = '';
    if (order.status === 'PAID') {
      downloadUrl = await generateDownloadUrl(order.book?.file_path || 'sample.pdf', order.id);
    }

    return NextResponse.json({ order, downloadUrl });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, email } = body;

    if (!order_id || !email) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสคำสั่งซื้อและอีเมลให้ถูกต้อง' }, { status: 400 });
    }

    // Strict lookup: requires matching email
    const order = await getOrder(order_id.trim(), email.trim().toLowerCase());

    if (!order) {
      return NextResponse.json(
        { error: 'ไม่พบคำสั่งซื้อ หรืออีเมลไม่ตรงกับข้อมูลในระบบ' },
        { status: 404 }
      );
    }

    let downloadUrl = '';
    if (order.status === 'PAID') {
      downloadUrl = await generateDownloadUrl(order.book?.file_path || 'sample.pdf', order.id);
    }

    return NextResponse.json({ order, downloadUrl });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
