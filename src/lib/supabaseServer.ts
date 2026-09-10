import { createClient } from '@supabase/supabase-js';
import { Order, OrderStatus } from './types';
import { INITIAL_BOOKS } from './booksData';

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
// In-Memory Fallback Store (Used when Supabase is not configured yet)
// ========================================================
const globalForOrders = global as unknown as { fallbackOrders: Map<string, Order> };
if (!globalForOrders.fallbackOrders) {
  globalForOrders.fallbackOrders = new Map<string, Order>();
}
export const fallbackOrders = globalForOrders.fallbackOrders;

/**
 * บันทึกคำสั่งซื้อใหม่ (ใช้ Supabase หากตั้งค่าไว้ มิฉะนั้นใช้ In-memory fallback)
 */
export async function saveOrder(order: Order): Promise<Order> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        id: order.id,
        book_id: order.book_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        amount: order.amount,
        status: order.status,
        paid_at: order.paid_at || null,
        download_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase saveOrder error:', error);
      throw new Error(error.message);
    }
    return { ...order, ...data };
  } else {
    // Fallback in-memory
    fallbackOrders.set(order.id, order);
    return order;
  }
}

/**
 * ดึงข้อมูลคำสั่งซื้อพร้อมความปลอดภัย (ต้องตรงทั้ง order_id และ customer_email หรือระบุ bypassEmail)
 */
export async function getOrder(orderId: string, customerEmail?: string): Promise<Order | null> {
  if (supabaseAdmin) {
    let query = supabaseAdmin.from('orders').select('*').eq('id', orderId);
    if (customerEmail) {
      query = query.eq('customer_email', customerEmail.toLowerCase().trim());
    }
    const { data, error } = await query.single();
    if (error || !data) return null;

    const book = INITIAL_BOOKS.find((b) => b.id === data.book_id);
    return { ...data, book };
  } else {
    const order = fallbackOrders.get(orderId);
    if (!order) return null;
    if (customerEmail && order.customer_email.toLowerCase().trim() !== customerEmail.toLowerCase().trim()) {
      return null;
    }
    const book = INITIAL_BOOKS.find((b) => b.id === order.book_id);
    return { ...order, book };
  }
}

/**
 * อัปเดตสถานะคำสั่งซื้อเป็น PAID
 */
export async function updateOrderStatusToPaid(orderId: string): Promise<Order | null> {
  const paidAt = new Date().toISOString();

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'PAID',
        paid_at: paidAt,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !data) {
      console.error('Failed to update order status in Supabase:', error);
      return null;
    }
    const book = INITIAL_BOOKS.find((b) => b.id === data.book_id);
    return { ...data, book };
  } else {
    const order = fallbackOrders.get(orderId);
    if (!order) return null;
    order.status = 'PAID';
    order.paid_at = paidAt;
    fallbackOrders.set(orderId, order);
    const book = INITIAL_BOOKS.find((b) => b.id === order.book_id);
    return { ...order, book };
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
