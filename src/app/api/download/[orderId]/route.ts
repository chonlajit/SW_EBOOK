import { NextResponse } from 'next/server';
import { getOrder } from '@/lib/supabaseServer';
import fs from 'fs';
import path from 'path';

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { orderId } = await params;

    const order = await getOrder(orderId);
    if (!order) {
      return new NextResponse('ไม่พบคำสั่งซื้อ', { status: 404 });
    }

    if (order.status !== 'PAID') {
      return new NextResponse('สิทธิ์ถูกปฏิเสธ: คำสั่งซื้อนี้ยังไม่ได้ชำระเงิน (สถานะปัจจุบัน: PENDING)', {
        status: 403,
      });
    }

    // Read the sample PDF file
    const filePath = path.join(process.cwd(), 'public', 'sample-ebook.pdf');
    if (!fs.existsSync(filePath)) {
      return new NextResponse('ไม่พบไฟล์ E-book บนเซิร์ฟเวอร์', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${order.book?.id || 'ebook'}-licensed.pdf`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: unknown) {
    console.error('Download route error:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
