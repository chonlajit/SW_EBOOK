'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div style={{ padding: '4rem 1rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div className="container" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div
          className="tech-box"
          style={{
            padding: '2.5rem 2rem',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid rgba(10, 10, 12, 0.12)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <h2
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#0a0a0c',
              fontFamily: 'var(--font-cyber)',
            }}
          >
            SYSTEM RECOVERY
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error.message || 'ระบบเกิดข้อผิดพลาดชั่วคราว'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="btn-cyber-red"
            style={{ padding: '0.65rem 1.6rem', fontSize: '0.9rem' }}
          >
            ลองใหม่อีกครั้ง (RETRY)
          </button>
        </div>
      </div>
    </div>
  );
}
