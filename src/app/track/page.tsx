'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mail, Hash, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orderId.trim()) {
      setErrorMsg('กรุณากรอกรหัสคำสั่งซื้อ เช่น ORD-...');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('กรุณากรอกอีเมลที่ใช้สั่งซื้อเพื่อยืนยันสิทธิ์');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.order) {
        throw new Error(data.error || 'ไม่พบคำสั่งซื้อที่ตรงกับรหัสและอีเมลนี้');
      }

      router.push(`/order/${data.order.id}/status`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตรวจสอบ';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem', maxWidth: '680px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-red)',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}>
          <span className="red-pin"></span>
          <span>// SECURE ORDER LOOKUP</span>
        </div>
        
        <h1 style={{
          fontFamily: 'var(--font-cyber)',
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#0a0a0c',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}>
          TRACK ORDER
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          กรอกรหัสคำสั่งซื้อและอีเมลเพื่อตรวจสอบสถานะและรับลิงก์ดาวน์โหลดซ้ำ (ปลอดภัย ไม่เปิดเผยข้อมูลผู้อื่น)
        </p>
      </div>

      <div className="tech-box" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
        {errorMsg && (
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 42, 42, 0.1)',
            border: '1.5px solid var(--accent-red)',
            borderRadius: '8px',
            color: 'var(--accent-red-dark)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a0a0c', marginBottom: '0.5rem' }}>
              รหัสคำสั่งซื้อ (ORDER ID)
            </label>
            <div style={{ position: 'relative' }}>
              <Hash size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="text"
                required
                placeholder="เช่น ORD-202609-4821"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="form-input-tech"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a0a0c', marginBottom: '0.5rem' }}>
              อีเมลที่ใช้สั่งซื้อ (EMAIL)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="email"
                required
                placeholder="เช่น name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input-tech"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div style={{
            marginBottom: '1.5rem',
            padding: '0.85rem',
            background: 'var(--bg-main)',
            borderRadius: '8px',
            border: '1px solid var(--border-tech)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ShieldCheck size={16} color="var(--accent-red)" style={{ flexShrink: 0 }} />
            <span>ระบบตรวจสอบความถูกต้องของอีเมลเพื่อป้องกันการเข้าถึงข้อมูลของลูกค้ารายอื่น</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber-red"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>กำลังค้นหาข้อมูล...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>ค้นหาคำสั่งซื้อ (SEARCH)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
