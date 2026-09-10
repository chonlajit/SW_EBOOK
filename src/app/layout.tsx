import type { Metadata, Viewport } from 'next';
import './globals.css';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Vibe E-Book Store | ระบบร้านค้า E-book ตัวอย่าง (3 แพลตฟอร์ม)',
  description: 'ระบบร้านค้า E-book ฝั่งผู้ใช้งาน รองรับ Web, Android .APK (MIT App Inventor), และ Desktop .EXE (Electron) พร้อม Mock Payment และลิงก์ดาวน์โหลดปลอดภัย',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <DemoBanner />
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
