'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/types';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default function MockPaymentPage({ params }: Props) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
          if (data.order.status === 'PAID') {
            router.push(`/order/${orderId}/status`);
          }
        } else {
          setErrorMsg(data.error || 'ไม่พบคำสั่งซื้อนี้');
        }
      } catch (err) {
        setErrorMsg('เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router]);

  const handleSimulatePayment = async () => {
    setPaying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/payment/mock-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'ไม่สามารถจำลองการชำระเงินได้');
      }

      router.push(`/order/${orderId}/status?paid=true`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
      setErrorMsg(msg);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 1rem auto', color: 'var(--accent-red)' }} />
        <p>กำลังโหลดคำสั่งซื้อ...</p>
      </div>
    );
  }

  if (errorMsg && !order) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>เกิดข้อผิดพลาด</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{errorMsg}</p>
        <Link href="/" className="btn-cyber-outline">
          กลับสู่หน้าร้าน
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: '850px' }}>
      {/* Prominent Red DEMO ONLY Alert */}
      <div style={{
        background: '#0d0e12',
        border: '2px solid var(--accent-red)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        color: '#ffffff',
        boxShadow: '0 8px 30px rgba(255, 42, 42, 0.2)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          background: 'var(--accent-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          flexShrink: 0,
        }}>
          <AlertTriangle size={28} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-cyber)',
            fontSize: '1.2rem',
            fontWeight: 900,
            color: 'var(--accent-red)',
            marginBottom: '4px',
          }}>
            DEMO ONLY • ห้ามโอนเงินจริงเด็ดขาด
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            หน้านี้คือระบบจำลองขั้นตอนชำระเงินตามข้อกำหนดใบงาน ให้ท่านคลิกปุ่มสีแดง <strong>&ldquo;จำลองชำระเงินสำเร็จ&rdquo;</strong> เพื่ออัปเดตสถานะเป็น PAID และรับสิทธิ์ดาวน์โหลดไฟล์ E-book
          </p>
        </div>
      </div>

      {/* Main Payment Card */}
      <div className="tech-box" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1.5px solid var(--border-tech)',
          marginBottom: '2rem',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              ORDER REFERENCE
            </div>
            <div style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#0a0a0c',
            }}>
              #{order?.id}
            </div>
          </div>
          <OrderStatusBadge status={order?.status || 'PENDING'} />
        </div>

        {/* Order Details Grid */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border-tech)',
          borderRadius: '10px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>หนังสือ</span>
            <span style={{ fontWeight: 700, color: '#0a0a0c', fontSize: '0.92rem' }}>{order?.book?.title}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>ผู้สั่งซื้อ</span>
            <span style={{ fontWeight: 700, color: '#0a0a0c', fontSize: '0.92rem' }}>{order?.customer_name}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>อีเมลผู้รับ</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-red)', fontSize: '0.92rem' }}>{order?.customer_email}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block' }}>ยอดชำระ</span>
            <span style={{
              fontFamily: 'var(--font-cyber)',
              fontWeight: 900,
              color: '#0a0a0c',
              fontSize: '1.3rem',
            }}>
              ฿{order?.amount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Simulated QR Area */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1.5px dashed var(--border-tech)',
          marginBottom: '2rem',
        }}>
          <div style={{
            width: '190px',
            height: '190px',
            margin: '0 auto 1.25rem auto',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #0a0a0c',
            position: 'relative',
          }}>
            {/* SVG Simulated QR Graphic with Red Center Pin */}
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <rect width="100" height="100" fill="#ffffff" />
              <rect x="5" y="5" width="28" height="28" fill="#0a0a0c" />
              <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
              <rect x="13" y="13" width="12" height="12" fill="#0a0a0c" />

              <rect x="67" y="5" width="28" height="28" fill="#0a0a0c" />
              <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
              <rect x="75" y="13" width="12" height="12" fill="#0a0a0c" />

              <rect x="5" y="67" width="28" height="28" fill="#0a0a0c" />
              <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
              <rect x="13" y="75" width="12" height="12" fill="#0a0a0c" />

              <rect x="40" y="10" width="6" height="6" fill="#0a0a0c" />
              <rect x="52" y="15" width="6" height="6" fill="#0a0a0c" />
              <rect x="42" y="25" width="6" height="6" fill="#0a0a0c" />
              <rect x="10" y="45" width="6" height="6" fill="#0a0a0c" />
              <rect x="25" y="48" width="6" height="6" fill="#0a0a0c" />
              
              {/* Center Red Tech Core */}
              <rect x="40" y="40" width="20" height="20" fill="#ff2a2a" rx="4" />
              <circle cx="50" cy="50" r="4" fill="#ffffff" />

              <rect x="70" y="45" width="6" height="6" fill="#0a0a0c" />
              <rect x="85" y="52" width="6" height="6" fill="#0a0a0c" />
              <rect x="45" y="72" width="6" height="6" fill="#0a0a0c" />
              <rect x="60" y="80" width="6" height="6" fill="#0a0a0c" />
            </svg>

            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--accent-red)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '1px',
              fontFamily: 'var(--font-cyber)',
              whiteSpace: 'nowrap',
            }}>
              DEMO ONLY
            </div>
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a0a0c', marginTop: '1rem' }}>
            QR Code จำลอง (PromptPay Mockup)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 700 }}>
            * ไม่ใช่ QR ธนาคารจริง - ให้กดปุ่มด้านล่างเพื่อจำลองการจ่าย *
          </div>
        </div>

        {/* Action Button: จำลองชำระเงินสำเร็จ */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSimulatePayment}
            disabled={paying}
            className="btn-cyber-red"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.05rem',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            {paying ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>กำลังบันทึกสถานะ PAID & ส่งอีเมล...</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>จำลองชำระเงินสำเร็จ (DEMO PAID)</span>
              </>
            )}
          </button>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            คลิกปุ่มเพื่อเปลี่ยนสถานะเป็น PAID, ออก Signed URL ชั่วคราว และส่งอีเมลยืนยัน
          </p>
        </div>
      </div>
    </div>
  );
}
