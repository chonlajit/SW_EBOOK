'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu as MenuIcon } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // Do not render Navbar on landing page (user explicitly requested to remove bar on landing page)
  if (pathname === '/') {
    return null;
  }

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1.5px solid var(--border-tech)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        gap: '1.5rem',
      }}>
        {/* Brand: E-BOOK */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-cyber)',
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#0a0a0c',
            letterSpacing: '-1px',
            textTransform: 'uppercase',
          }}>
            E-BOOK
          </span>
          <span style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-red)',
            borderRadius: '2px',
          }}></span>
        </Link>

        {/* Center Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: '550px',
          position: 'relative',
        }}>
          <form action="/track" method="GET" style={{ display: 'flex', width: '100%' }}>
            <input
              type="text"
              name="q"
              placeholder="ค้นหาชื่อหนังสือ, รหัสคำสั่งซื้อ หรือค้นหาในระบบ..."
              style={{
                width: '100%',
                padding: '0.65rem 2.75rem 0.65rem 1.25rem',
                borderRadius: '9999px',
                border: '1.5px solid rgba(10, 10, 12, 0.2)',
                backgroundColor: '#ffffff',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-tech)',
                color: '#0a0a0c',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#0a0a0c',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              title="ค้นหา"
            >
              <Search size={15} />
            </button>
          </form>
        </div>

        {/* Right Menu & Tracking */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/track"
            className="btn-cyber-outline"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            ติดตามคำสั่งซื้อ
          </Link>
          
          <Link
            href="/"
            style={{
              padding: '0.45rem 1rem',
              border: '2px solid #0a0a0c',
              borderRadius: '6px',
              fontWeight: 800,
              fontFamily: 'var(--font-cyber)',
              fontSize: '0.9rem',
              color: '#0a0a0c',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
            }}
          >
            <span>MENU</span>
            <MenuIcon size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
