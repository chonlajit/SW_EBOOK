import { Book } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-vibe-coding',
    title: 'Mastering Vibe Coding with AI',
    author: 'Dev Guru & DeepMind Pair',
    description: 'คู่มือฉบับสมบูรณ์สำหรับการเขียนโค้ดร่วมกับ AI อย่างมีเป้าหมาย เข้าใจสถาปัตยกรรม เขียน Prompt แบบควบคุมงานได้ พร้อมรับมือกับ Bug และ Deploy ขึ้น Cloud',
    price: 199.00,
    cover_url: '/covers/book1.svg',
    file_path: 'sample-vibe-coding.pdf',
    tags: ['AI', 'Prompting', 'Productivity'],
    pages: 220,
  },
  {
    id: 'book-nextjs-supabase',
    title: 'Next.js 15 & Supabase Fullstack Blueprint',
    author: 'Alex Rivera',
    description: 'เรียนรู้การสร้างเว็บแอปพลิเคชันระดับ Production ด้วย Next.js App Router, Supabase PostgreSQL, Authentication, Row Level Security และ Private Storage',
    price: 249.00,
    cover_url: '/covers/book2.svg',
    file_path: 'sample-nextjs-supabase.pdf',
    tags: ['Next.js', 'Supabase', 'Fullstack'],
    pages: 310,
  },
  {
    id: 'book-web-to-mobile',
    title: 'From Web to Mobile App: Complete Wrapper Guide',
    author: 'Sarah Chen',
    description: 'แนวทางการแปลง Web Application เป็น Mobile App และ Desktop App อย่างรวดเร็วด้วย MIT App Inventor, WebViewer และ Electron พัฒนาครั้งเดียวใช้ได้ทุกอุปกรณ์',
    price: 179.00,
    cover_url: '/covers/book3.svg',
    file_path: 'sample-web-to-mobile.pdf',
    tags: ['Mobile', 'MIT App Inventor', 'Android'],
    pages: 185,
  },
];

export function getBookById(id: string): Book | undefined {
  return INITIAL_BOOKS.find((b) => b.id === id);
}
