import type { Metadata, Viewport } from 'next';
import './globals.css';
import FigmaTopNav from '@/components/FigmaTopNav';
import FigmaFooter from '@/components/FigmaFooter';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'CJ SHOP // E-BOOK | Platform to sale Books for DEVELOPER!!!!',
  description: 'Platform to sale Books for DEVELOPER!!!! ระบบร้านค้า E-book ตัวอย่าง (3 แพลตฟอร์ม Web, Android, Desktop)',
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
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--figma-pink)', overflow: 'visible' }}>
        <Providers>
          <header
            className="figma-bg-pink-dots"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              width: '100%',
              paddingTop: '0.65rem',
              paddingBottom: '0.65rem',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08)',
            }}
          >
            <FigmaTopNav />
          </header>
          <main style={{ flex: 1, backgroundColor: 'var(--figma-pink)', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <FigmaFooter />
        </Providers>
      </body>
    </html>
  );
}
