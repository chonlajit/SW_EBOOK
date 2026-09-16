import { NextResponse } from 'next/server';
import {
  getAllBooks,
  addServerBook,
  updateServerBook,
  deleteServerBook,
  resetServerBooks,
} from '@/lib/booksServer';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { INITIAL_BOOKS } from '@/lib/booksData';
import { Book } from '@/lib/types';

export async function GET() {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return NextResponse.json({ books: data });
      }
    } catch (e) {
      console.warn('Supabase books GET error, using fallback:', e);
    }
  }
  return NextResponse.json({ books: getAllBooks() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, description, price, cover_url, file_path, tags, pages } = body;

    // Field validations
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อหนังสือ' }, { status: 400 });
    }
    if (!author || !author.trim()) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อผู้เขียน' }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'กรุณาระบุคำอธิบายหนังสือ' }, { status: 400 });
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: 'กรุณาระบุราคาที่ถูกต้อง (ตัวเลข >= 0)' }, { status: 400 });
    }

    const newBook: Book = {
      id: body.id || `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      price: numPrice,
      cover_url: (cover_url && cover_url.trim()) ? cover_url.trim() : '/covers/book1.svg',
      file_path: (file_path && file_path.trim()) ? file_path.trim() : 'sample-vibe-coding.pdf',
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map((t: string) => t.trim()) : ['E-BOOK']),
      pages: Number(pages) || 120,
    };

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('books')
        .insert(newBook)
        .select()
        .single();
      if (!error && data) {
        const { data: allBooks } = await supabaseAdmin
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });
        return NextResponse.json({
          success: true,
          book: data,
          books: allBooks || [data],
          message: 'เพิ่มหนังสือใหม่ลง Supabase เรียบร้อยแล้ว',
        });
      }
    }

    const saved = addServerBook(newBook);
    return NextResponse.json({
      success: true,
      book: saved,
      books: getAllBooks(),
      message: 'เพิ่มหนังสือใหม่เรียบร้อยแล้ว',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ไม่พบ ID หนังสือที่ต้องการลบ' }, { status: 400 });
    }

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('books').delete().eq('id', id);
      if (!error) {
        const { data: allBooks } = await supabaseAdmin
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });
        return NextResponse.json({
          success: true,
          books: allBooks || [],
          message: 'ลบหนังสือออกจาก Supabase เรียบร้อยแล้ว',
        });
      }
    }

    const deleted = deleteServerBook(id);
    if (!deleted) {
      return NextResponse.json({ error: 'ไม่พบหนังสือที่ระบุ' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      books: getAllBooks(),
      message: 'ลบหนังสือออกจากระบบเรียบร้อยแล้ว',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

// Reset books to INITIAL_BOOKS
export async function PUT() {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('books').upsert(INITIAL_BOOKS);
      const { data: allBooks } = await supabaseAdmin
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      return NextResponse.json({
        success: true,
        books: allBooks || INITIAL_BOOKS,
        message: 'รีเซ็ตรายการหนังสือใน Supabase เรียบร้อยแล้ว',
      });
    } catch (e) {
      console.warn('Supabase reset error:', e);
    }
  }

  const books = resetServerBooks();
  return NextResponse.json({
    success: true,
    books,
    message: 'รีเซ็ตรายการหนังสือกลับเป็นค่าเริ่มต้นแล้ว',
  });
}

// Edit/Update book information
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, title, author, description, price, cover_url, file_path, tags, pages } = body;

    if (!id) {
      return NextResponse.json({ error: 'ไม่พบ ID หนังสือที่ต้องการแก้ไข' }, { status: 400 });
    }

    const updatePayload: Partial<Book> = {};
    if (title !== undefined) updatePayload.title = title.trim();
    if (author !== undefined) updatePayload.author = author.trim();
    if (description !== undefined) updatePayload.description = description.trim();
    if (price !== undefined) {
      const p = Number(price);
      if (!isNaN(p) && p >= 0) updatePayload.price = p;
    }
    if (cover_url !== undefined) updatePayload.cover_url = cover_url.trim();
    if (file_path !== undefined) updatePayload.file_path = file_path.trim();
    if (tags !== undefined) {
      updatePayload.tags = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (pages !== undefined) updatePayload.pages = Number(pages) || 100;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('books')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const { data: allBooks } = await supabaseAdmin
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });
        return NextResponse.json({
          success: true,
          book: data,
          books: allBooks || [],
          message: 'แก้ไขข้อมูลหนังสือใน Supabase เรียบร้อยแล้ว',
        });
      }
    }

    const updated = updateServerBook(id, updatePayload);

    return NextResponse.json({
      success: true,
      book: updated,
      books: getAllBooks(),
      message: 'แก้ไขข้อมูลหนังสือเรียบร้อยแล้ว',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
