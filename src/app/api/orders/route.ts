import { NextResponse } from 'next/server';
import { getBookById } from '@/lib/booksData';
import { saveOrder } from '@/lib/supabaseServer';
import { Order } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { book_id, customer_name, customer_email } = body;

    if (!book_id || !customer_name || !customer_email) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const book = getBookById(book_id);
    if (!book) {
      return NextResponse.json(
        { error: 'ไม่พบหนังสือที่ระบุ' },
        { status: 404 }
      );
    }

    // Generate readable Order ID e.g. ORD-202609-4821
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-202609-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      book_id: book.id,
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      amount: book.price,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    const saved = await saveOrder(newOrder);

    return NextResponse.json({
      success: true,
      order: saved,
    });
  } catch (error: unknown) {
    console.error('API /api/orders error:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
