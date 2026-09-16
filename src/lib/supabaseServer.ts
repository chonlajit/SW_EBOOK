import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Order, OrderStatus, Book } from './types';
import { INITIAL_BOOKS } from './booksData';
import { getBookById } from './booksServer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseServerConfigured = Boolean(
  supabaseUrl && 
  supabaseServiceKey && 
  !supabaseUrl.includes('your-project')
);

export const supabaseAdmin = isSupabaseServerConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

// ========================================================
// In-Memory & File Fallback Store (Used when Supabase is not configured yet)
// ========================================================
const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

function loadFallbackOrders(): Map<string, Order> {
  const map = new Map<string, Order>();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          map.set(item.id, item);
        }
      }
    }
  } catch (err) {
    console.warn('Failed to read data/orders.json:', err);
  }
  return map;
}

function persistFallbackOrders(map: Map<string, Order>) {
  try {
    const dir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const list = Array.from(map.values());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write data/orders.json:', err);
  }
}

const globalForOrders = global as unknown as { fallbackOrders: Map<string, Order> };
if (!globalForOrders.fallbackOrders) {
  globalForOrders.fallbackOrders = loadFallbackOrders();
}
export const fallbackOrders = globalForOrders.fallbackOrders;

/**
 * บันทึกคำสั่งซื้อใหม่ (ใช้ Supabase หากตั้งค่าไว้ มิฉะนั้นใช้ In-memory & JSON file fallback)
 * รองรับทั้งออเดอร์เล่มเดียวและหลายเล่มพร้อมกัน (Cart multi-item checkout)
 */
export async function saveOrder(order: Order, additionalOrders: Order[] = []): Promise<Order> {
  if (supabaseAdmin) {
    const allToInsert = [order, ...additionalOrders].map((o) => ({
      id: o.id,
      book_id: o.book_id,
      customer_name: o.customer_name,
      customer_email: o.customer_email,
      amount: o.amount,
      status: o.status,
      paid_at: o.paid_at || null,
      download_count: 0,
    }));

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(allToInsert)
      .select();

    if (error) {
      console.error('Supabase saveOrder error:', error);
      throw new Error(error.message);
    }
    return order;
  } else {
    // Fallback in-memory and persist to data/orders.json
    fallbackOrders.set(order.id, order);
    for (const add of additionalOrders) {
      fallbackOrders.set(add.id, add);
    }
    persistFallbackOrders(fallbackOrders);
    return order;
  }
}

/**
 * ดึงข้อมูลคำสั่งซื้อพร้อมความปลอดภัย (ต้องตรงทั้ง order_id และ customer_email หรือระบุ bypassEmail)
 * รองรับการดึงข้อมูลหนังสือครบทุกเล่มในกรณีที่สั่งซื้อหลายเล่มพร้อมกัน
 */
export async function getOrder(orderId: string, customerEmail?: string): Promise<Order | null> {
  if (supabaseAdmin) {
    let query = supabaseAdmin.from('orders').select('*').like('id', `${orderId}%`);
    if (customerEmail) {
      query = query.eq('customer_email', customerEmail.toLowerCase().trim());
    }
    const { data: rows, error } = await query;
    if (error || !rows || rows.length === 0) return null;

    const mainOrder = rows.find((r: any) => r.id === orderId) || rows[0];

    // Fetch all books for rows
    const bookIds = rows.map((r: any) => r.book_id);
    let bookMap = new Map();
    try {
      const { data: booksData } = await supabaseAdmin.from('books').select('*').in('id', bookIds);
      if (booksData) {
        bookMap = new Map(booksData.map((b: any) => [b.id, b]));
      }
    } catch {}

    const allBooks: Book[] = rows.map((r: any) => {
      return bookMap.get(r.book_id) || getBookById(r.book_id) || INITIAL_BOOKS.find((b) => b.id === r.book_id) || {
        id: r.book_id,
        title: 'E-Book',
        author: 'Dev',
        description: '',
        price: Number(r.amount) || 0,
        cover_url: '/covers/book1.svg',
        file_path: 'sample-ebook.pdf',
      };
    });

    const totalAmount = rows.reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);

    return {
      ...mainOrder,
      amount: totalAmount,
      book: allBooks[0],
      books: allBooks,
    };
  } else {
    const matching: Order[] = [];
    for (const [id, o] of fallbackOrders.entries()) {
      if (id.startsWith(orderId)) {
        if (!customerEmail || o.customer_email.toLowerCase().trim() === customerEmail.toLowerCase().trim()) {
          matching.push(o);
        }
      }
    }
    if (matching.length === 0) return null;
    const mainOrder = matching.find((o) => o.id === orderId) || matching[0];
    const allBooks = matching.map((o) => getBookById(o.book_id) || INITIAL_BOOKS.find((b) => b.id === o.book_id)!);
    const totalAmount = matching.reduce((sum, o) => sum + Number(o.amount || 0), 0);

    return {
      ...mainOrder,
      amount: totalAmount,
      book: allBooks[0],
      books: allBooks,
    };
  }
}

/**
 * ดึงประวัติคำสั่งซื้อทั้งหมดตาม Email (หรือทั้งหมดถ้าไม่ระบุ)
 */
export async function getOrdersByEmail(customerEmail?: string): Promise<Order[]> {
  if (supabaseAdmin) {
    let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
    if (customerEmail && customerEmail.trim()) {
      query = query.eq('customer_email', customerEmail.toLowerCase().trim());
    }
    const { data, error } = await query;
    if (error || !data) return [];
    
    let bookMap = new Map();
    try {
      const { data: allBooks } = await supabaseAdmin.from('books').select('*');
      if (allBooks) {
        bookMap = new Map(allBooks.map((b: any) => [b.id, b]));
      }
    } catch {}

    return data.map((d: any) => ({
      ...d,
      book: bookMap.get(d.book_id) || getBookById(d.book_id) || INITIAL_BOOKS.find((b) => b.id === d.book_id),
    }));
  } else {
    const all = Array.from(fallbackOrders.values());
    let filtered = all;
    if (customerEmail && customerEmail.trim()) {
      const cleanEmail = customerEmail.toLowerCase().trim();
      filtered = all.filter((o) => o.customer_email?.toLowerCase().trim() === cleanEmail);
    }
    // Sort descending by created_at or id
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
    return filtered.map((o) => ({
      ...o,
      book: getBookById(o.book_id) || INITIAL_BOOKS.find((b) => b.id === o.book_id),
    }));
  }
}

/**
 * อัปเดตสถานะคำสั่งซื้อเป็น PAID (รวมถึงทุกรายการย่อยในคำสั่งซื้อนั้น)
 */
export async function updateOrderStatusToPaid(orderId: string): Promise<Order | null> {
  const paidAt = new Date().toISOString();

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'PAID',
        paid_at: paidAt,
      })
      .like('id', `${orderId}%`);

    if (error) {
      console.error('Failed to update order status in Supabase:', error);
      return null;
    }
    return getOrder(orderId);
  } else {
    for (const [id, o] of fallbackOrders.entries()) {
      if (id.startsWith(orderId)) {
        o.status = 'PAID';
        o.paid_at = paidAt;
      }
    }
    persistFallbackOrders(fallbackOrders);
    return getOrder(orderId);
  }
}

/**
 * สร้าง Signed URL สำหรับดาวน์โหลด E-book ชั่วคราว (อายุ 2 ชั่วโมง)
 */
export async function generateDownloadUrl(filePath: string, orderId: string): Promise<string> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from('ebooks')
        .createSignedUrl(filePath, 7200); // 2 hours

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch (err) {
      console.error('Error generating Supabase signed URL:', err);
    }
  }

  // Fallback direct download route from server
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/download/${orderId}?token=demo-temp-${Date.now()}`;
}

/**
 * ดึงข้อมูลหนังสือตามรายการ ID จาก Supabase (พร้อม fallback ไปยัง serverBooks / INITIAL_BOOKS)
 */
export async function fetchBooksByIds(ids: string[]): Promise<Book[]> {
  const foundBooks: Book[] = [];
  if (supabaseAdmin && ids.length > 0) {
    try {
      const { data, error } = await supabaseAdmin.from('books').select('*').in('id', ids);
      if (!error && data && data.length > 0) {
        foundBooks.push(...data);
      }
    } catch (e) {
      console.warn('Failed to fetch books from Supabase:', e);
    }
  }

  // Fill in any remaining books from serverBooks or INITIAL_BOOKS
  for (const id of ids) {
    if (!foundBooks.some((b) => b.id === id)) {
      const fallback = getBookById(id) || INITIAL_BOOKS.find((b) => b.id === id);
      if (fallback) {
        foundBooks.push(fallback);
      }
    }
  }

  return foundBooks;
}
