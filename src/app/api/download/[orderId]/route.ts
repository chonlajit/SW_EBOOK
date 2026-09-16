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

    const { searchParams } = new URL(request.url);
    const requestedBookId = searchParams.get('bookId');
    const targetBook = (requestedBookId && order.books)
      ? (order.books.find((b) => b.id === requestedBookId) || order.book)
      : order.book;

    // Check if book has a custom file_path
    const rawPath = targetBook?.file_path || '';
    
    // If it's an external URL, redirect directly
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      return NextResponse.redirect(rawPath);
    }

    // Try reading specific uploaded file or public file
    let targetFilePath = path.join(process.cwd(), 'public', rawPath.replace(/^\//, ''));
    if (!rawPath || !fs.existsSync(targetFilePath)) {
      // Fallback to sample-ebook.pdf
      targetFilePath = path.join(process.cwd(), 'public', 'sample-ebook.pdf');
    }

    if (!fs.existsSync(targetFilePath)) {
      return new NextResponse('ไม่พบไฟล์ E-book บนเซิร์ฟเวอร์', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(targetFilePath);
    const ext = path.extname(targetFilePath) || '.pdf';
    const cleanBookTitle = (targetBook?.title || 'ebook').replace(/[^a-zA-Z0-9ก-๙_-]/g, '_');
    const downloadFileName = `${cleanBookTitle}${ext}`;

    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.epub': 'application/epub+zip',
      '.zip': 'application/zip',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
    };
    const contentType = mimeTypes[ext.toLowerCase()] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(downloadFileName)}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: unknown) {
    console.error('Download route error:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
