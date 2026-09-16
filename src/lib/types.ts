export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_url: string;
  file_path: string;
  tags?: string[];
  pages?: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface Order {
  id: string;
  book_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: OrderStatus;
  paid_at?: string | null;
  download_count?: number;
  created_at?: string;
  book?: Book;
  books?: Book[];
  downloadUrls?: Array<{ bookTitle: string; url: string }>;
}

export interface CreateOrderPayload {
  book_id?: string;
  book_ids?: string[];
  customer_name: string;
  customer_email: string;
}

export interface MockPaymentResult {
  success: boolean;
  order_id: string;
  status: OrderStatus;
  download_url?: string;
  email_sent: boolean;
  message: string;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  created_at: string;
}

