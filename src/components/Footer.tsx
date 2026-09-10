import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Smartphone, Monitor, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1.5px solid var(--border-tech)',
      background: '#ffffff',
      padding: '3rem 0 2rem 0',
      color: '#0a0a0c',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-cyber)',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: '#0a0a0c',
              marginBottom: '0.75rem',
            }}>
              CJ SHOP // E-BOOK
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              ระบบร้านค้า E-book สไตล์ Futuristic ตามใบงาน Vibe Coding สำหรับสาธิตระบบฝั่งผู้ใช้ เชื่อมโยง Supabase, Vercel, MIT App Inventor (.apk) และ Electron (.exe)
            </p>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-tech)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#0a0a0c',
              marginBottom: '0.75rem',
            }}>
              3 แพลตฟอร์มการใช้งาน
            </div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={15} color="#0a0a0c" /> Web View (Responsive Vercel)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                <Smartphone size={15} /> Mobile View (.APK Wrapper)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Monitor size={15} color="#0a0a0c" /> Desktop View (.EXE Windows)
              </li>
            </ul>
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-tech)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#0a0a0c',
              marginBottom: '0.75rem',
            }}>
              ข้อกำหนดความปลอดภัย (DEMO)
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 700, marginBottom: '4px' }}>
                <ShieldCheck size={16} /> Mock Payment เพื่อการศึกษา
              </div>
              <p>ระบบไม่มีการตัดเงินจริง ลิงก์ดาวน์โหลดเป็นแบบจำกัดเวลา (Signed URL) หลังสถานะ PAID เท่านั้น</p>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-tech)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div>CJ SHOP • VIBE CODING PROJECT © 2026</div>
          <div>COLOR SPEC: WHITE / BLACK / RED RATIO</div>
        </div>
      </div>
    </footer>
  );
}
