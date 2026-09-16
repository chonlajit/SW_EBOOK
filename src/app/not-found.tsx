import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: 'var(--figma-pink)',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
          fontSize: '6rem',
          color: '#000000',
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: "var(--font-ubuntu-mono), monospace",
          fontSize: '1.25rem',
          color: '#000000',
          marginTop: '1rem',
          marginBottom: '2rem',
        }}
      >
        ไม่พบหน้าที่คุณต้องการ
      </p>
      <Link
        href="/"
        style={{
          backgroundColor: '#1C3002',
          color: '#E9FFB6',
          padding: '0.75rem 2rem',
          borderRadius: '4px',
          fontFamily: 'var(--font-tech)',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        กลับหน้าหลัก (HOME)
      </Link>
    </div>
  );
}
