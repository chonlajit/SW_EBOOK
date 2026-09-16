import { NextResponse } from 'next/server';
import { getBookById } from '@/lib/booksServer';
import { saveOrder, getOrdersByEmail, generateDownloadUrl, fetchBooksByIds } from '@/lib/supabaseServer';
import { Order } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const orders = await getOrdersByEmail(email || undefined);

    // Attach download URLs for orders that have status === 'PAID'
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        let downloadUrl = '';
        if (order.status === 'PAID') {
          downloadUrl = await generateDownloadUrl(order.book?.file_path || 'sample.pdf', order.id);
        }
        return {
          ...order,
          downloadUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: enrichedOrders,
    });
  } catch (error: unknown) {
    console.error('API GET /api/orders error:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { book_id, book_ids, customer_name, customer_email } = body;

    if ((!book_id && (!book_ids || book_ids.length === 0)) || !customer_name || !customer_email) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const allBookIds: string[] = Array.isArray(book_ids) && book_ids.length > 0 
      ? book_ids 
      : [book_id];

    // Fetch all books (queries Supabase with fallback to local books)
    const books = await fetchBooksByIds(allBookIds);

    if (books.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบหนังสือที่ระบุ' },
        { status: 404 }
      );
    }

    // Generate readable Order ID e.g. ORD-202609-4821
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-202609-${randomSuffix}`;

    const mainBook = books[0];
    const mainOrder: Order = {
      id: orderId,
      book_id: mainBook.id,
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      amount: mainBook.price,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    const additionalOrders: Order[] = books.slice(1).map((b, idx) => ({
      id: `${orderId}-${idx + 2}`,
      book_id: b.id,
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      amount: b.price,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    }));

    const saved = await saveOrder(mainOrder, additionalOrders);
    const totalAmount = books.reduce((sum, b) => sum + Number(b.price || 0), 0);

    return NextResponse.json({
      success: true,
      order: {
        ...saved,
        amount: totalAmount,
        books,
      },
    });
  } catch (error: unknown) {
    console.error('API /api/orders error:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

