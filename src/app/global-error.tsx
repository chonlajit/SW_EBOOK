'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body style={{ fontFamily: 'sans-serif', padding: '3rem 1rem', textAlign: 'center', background: '#f8fafc' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0a0a0c' }}>
            เกิดข้อผิดพลาดในการแสดงผล
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error.message || 'ระบบเกิดข้อผิดพลาดชั่วคราว'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '0.65rem 1.6rem',
              backgroundColor: '#ff2a2a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            โหลดหน้านี้ใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
