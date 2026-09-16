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
      <div
        className="figma-bg-pink-dots"
        style={{
          flex: 1,
          padding: '5rem',
          textAlign: 'center',
          fontFamily: 'var(--font-ubuntu-mono), monospace',
          color: '#1C3002',
        }}
      >
        <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 1rem auto', color: '#1C3002' }} />
        <p>กำลังโหลดคำสั่งซื้อ...</p>
      </div>
    );
  }

  if (errorMsg && !order) {
    return (
      <div className="figma-bg-pink-dots" style={{ flex: 1, padding: '4rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '8px solid #E9FFB6',
            borderRadius: '4px',
            padding: '2.5rem',
            maxWidth: '500px',
            margin: '0 auto',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          }}
        >
          <h2 style={{ color: '#000000', fontFamily: 'var(--font-victory)', marginBottom: '1rem' }}>เกิดข้อผิดพลาด</h2>
          <p style={{ color: '#5E6C4B', fontFamily: 'var(--font-ubuntu-mono)', marginBottom: '2rem' }}>{errorMsg}</p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1C3002',
              color: '#E9FFB6',
              border: '2px solid #000000',
              borderRadius: '4px',
              fontFamily: 'var(--font-victory)',
              textDecoration: 'none',
              fontWeight: 900,
            }}
          >
            กลับสู่หน้าร้าน
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="figma-bg-pink-dots"
      style={{
        flex: 1,
        padding: '3rem 1rem 5rem 1rem',
        minHeight: '100%',
      }}
    >
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Prominent Demo Notice Banner */}
        <div
          style={{
            backgroundColor: '#1C3002',
            border: '4px solid #E9FFB6',
            borderRadius: '4px',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            color: '#ffffff',
            boxShadow: '0 10px 28px rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '4px',
              backgroundColor: '#E9FFB6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1C3002',
              flexShrink: 0,
              border: '1.5px solid #000000',
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-victory), sans-serif",
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#E9FFB6',
                marginBottom: '4px',
              }}
            >
              DEMO ONLY • ห้ามโอนเงินจริงเด็ดขาด
            </div>
            <p style={{ fontSize: '0.88rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#D9D9D9', margin: 0, lineHeight: 1.5 }}>
              หน้านี้คือระบบจำลองขั้นตอนชำระเงินตามข้อกำหนดใบงาน ให้ท่านคลิกปุ่ม <strong>&ldquo;จำลองชำระเงินสำเร็จ&rdquo;</strong> เพื่ออัปเดตสถานะเป็น PAID และรับสิทธิ์ดาวน์โหลดไฟล์ E-book
            </p>
          </div>
        </div>

        {/* Main Payment Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '8px solid #E9FFB6',
            borderRadius: '4px',
            padding: '2.5rem 2rem',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              paddingBottom: '1.5rem',
              borderBottom: '2.5px solid #000000',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B' }}>
                ORDER REFERENCE
              </div>
              <div
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#000000',
                }}
              >
                #{order?.id}
              </div>
            </div>
            <OrderStatusBadge status={order?.status || 'PENDING'} />
          </div>

          {/* Order Details Grid */}
          <div
            style={{
              backgroundColor: '#FFDED9',
              border: '2px solid #000000',
              borderRadius: '4px',
              padding: '1.25rem',
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
            }}
          >
            <div>
              <span style={{ fontSize: '0.78rem', color: '#5E6C4B', display: 'block' }}>
                {order?.books && order.books.length > 1 ? `รายการหนังสือ (${order.books.length} เล่ม)` : 'หนังสือ'}
              </span>
              {order?.books && order.books.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                  {order.books.map((b) => (
                    <div key={b.id} style={{ fontWeight: 700, color: '#000000', fontSize: '0.88rem' }}>
                      • {b.title}
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontWeight: 700, color: '#000000', fontSize: '0.95rem' }}>{order?.book?.title}</span>
              )}
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#5E6C4B', display: 'block' }}>ผู้สั่งซื้อ</span>
              <span style={{ fontWeight: 700, color: '#000000', fontSize: '0.95rem' }}>{order?.customer_name}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#5E6C4B', display: 'block' }}>อีเมลผู้รับ</span>
              <span style={{ fontWeight: 700, color: '#1C3002', fontSize: '0.95rem' }}>{order?.customer_email}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#5E6C4B', display: 'block' }}>ยอดชำระ</span>
              <span
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontWeight: 900,
                  color: '#1C3002',
                  fontSize: '1.5rem',
                }}
              >
                ฿{order?.amount?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Simulated QR Area */}
          <div
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              border: '2px dashed #000000',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                width: '190px',
                height: '190px',
                margin: '0 auto 1.25rem auto',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                padding: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid #000000',
                position: 'relative',
              }}
            >
              {/* SVG Simulated QR Graphic */}
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="5" y="5" width="28" height="28" fill="#000000" />
                <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
                <rect x="13" y="13" width="12" height="12" fill="#000000" />

                <rect x="67" y="5" width="28" height="28" fill="#000000" />
                <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
                <rect x="75" y="13" width="12" height="12" fill="#000000" />

                <rect x="5" y="67" width="28" height="28" fill="#000000" />
                <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
                <rect x="13" y="75" width="12" height="12" fill="#000000" />

                <rect x="40" y="10" width="6" height="6" fill="#000000" />
                <rect x="52" y="15" width="6" height="6" fill="#000000" />
                <rect x="42" y="25" width="6" height="6" fill="#000000" />
                <rect x="10" y="45" width="6" height="6" fill="#000000" />
                <rect x="25" y="48" width="6" height="6" fill="#000000" />

                {/* Center Core */}
                <rect x="40" y="40" width="20" height="20" fill="#1C3002" rx="2" />
                <circle cx="50" cy="50" r="4" fill="#E9FFB6" />

                <rect x="70" y="45" width="6" height="6" fill="#000000" />
                <rect x="85" y="52" width="6" height="6" fill="#000000" />
                <rect x="45" y="72" width="6" height="6" fill="#000000" />
                <rect x="60" y="80" width="6" height="6" fill="#000000" />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#E9FFB6',
                  color: '#1C3002',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '3px',
                  border: '1px solid #000000',
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                DEMO ONLY
              </div>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 900, fontFamily: "var(--font-victory), sans-serif", color: '#000000', marginTop: '1rem' }}>
              QR Code (Mockup)
            </div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#1C3002', fontWeight: 700 }}>
              * ไม่ใช่ QR ธนาคารจริง - ให้กดปุ่มด้านล่างเพื่อจำลองการจ่าย *
            </div>
          </div>

          {/* Action Button: จำลองชำระเงินสำเร็จ */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSimulatePayment}
              disabled={paying}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.25rem',
                fontFamily: "var(--font-victory), sans-serif",
                fontWeight: 900,
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#1C3002',
                color: '#E9FFB6',
                border: '2px solid #000000',
                borderRadius: '4px',
                cursor: paying ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => !paying && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !paying && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {paying ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  <span>กำลังบันทึกสถานะ PAID & ส่งอีเมล...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={22} />
                  <span>ชำระเงิน (DEMO PAID)</span>
                </>
              )}
            </button>

            <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B', marginTop: '0.85rem' }}>
              คลิกปุ่มเพื่อเปลี่ยนสถานะเป็น PAID, ออก Signed URL ชั่วคราว และส่งอีเมลยืนยัน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
