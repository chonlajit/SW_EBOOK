'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/lib/types';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { CheckCircle2, Download, Mail, ArrowRight, ShieldCheck, Clock, RefreshCw, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ orderId: string }>;
}

function OrderStatusContent({ params }: Props) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const searchParams = useSearchParams();
  const justPaid = searchParams.get('paid') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [downloadUrls, setDownloadUrls] = useState<Array<{ bookId: string; title: string; url: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadOrderStatus() {
      try {
        const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (res.ok && data.order) {
          setOrder(data.order);
          if (data.downloadUrl) {
            setDownloadUrl(data.downloadUrl);
          }
          if (data.downloadUrls && Array.isArray(data.downloadUrls)) {
            setDownloadUrls(data.downloadUrls);
          }
        } else {
          setErrorMsg(data.error || 'ไม่พบข้อมูลคำสั่งซื้อ');
        }
      } catch (err) {
        setErrorMsg('เกิดข้อผิดพลาดในการโหลดสถานะคำสั่งซื้อ');
      } finally {
        setLoading(false);
      }
    }

    loadOrderStatus();
  }, [orderId]);

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
        <RefreshCw className="animate-spin" size={36} style={{ margin: '0 auto 1rem auto', color: '#1C3002' }} />
        <p>กำลังโหลดสถานะคำสั่งซื้อ...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
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
          <h2 style={{ color: '#000000', fontFamily: 'var(--font-victory)', marginBottom: '1rem' }}>ไม่พบข้อมูลคำสั่งซื้อ</h2>
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

  const isPaid = order.status === 'PAID';

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
        {/* Celebration Banner when PAID */}
        {isPaid && (
          <div
            style={{
              backgroundColor: '#1C3002',
              border: '4px solid #E9FFB6',
              borderRadius: '4px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#E9FFB6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: '#1C3002',
                border: '2px solid #000000',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h1
              style={{
                fontFamily: "var(--font-milker), sans-serif",
                fontSize: '2rem',
                fontWeight: 900,
                color: '#E9FFB6',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem',
              }}
            >
              ORDER VERIFIED • STATUS: PAID
            </h1>
            <p style={{ color: '#D9D9D9', fontFamily: 'var(--font-ubuntu-mono), monospace', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.25rem auto' }}>
              การชำระเงินจำลองเสร็จสมบูรณ์ ระบบได้ออกลิงก์ดาวน์โหลด E-book ปลอดภัยสำหรับคุณแล้ว
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '4px',
                backgroundColor: '#213902',
                border: '1.5px solid #E9FFB6',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                color: '#E9FFB6',
              }}
            >
              <Mail size={16} color="#E9FFB6" />
              <span>ส่งลิงก์ยืนยันไปยัง: <strong>{order.customer_email}</strong></span>
            </div>
          </div>
        )}

        {/* Main Order Details Card */}
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
                #{order.id}
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Book summary items */}
          {order.books && order.books.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.88rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#1C3002', fontWeight: 700 }}>
                รายการหนังสือที่สั่งซื้อ ({order.books.length} เล่ม)
              </div>
              {order.books.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    backgroundColor: '#FFDED9',
                    padding: '1rem',
                    borderRadius: '4px',
                    border: '2px solid #000000',
                  }}
                >
                  {b.cover_url && (
                    <img
                      src={b.cover_url}
                      alt={b.title}
                      style={{ width: '55px', height: '75px', objectFit: 'cover', borderRadius: '2px', border: '2px solid #000000' }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: "var(--font-victory), sans-serif", color: '#000000', marginBottom: '2px' }}>
                      {b.title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B' }}>
                      ผู้แต่ง: {b.author}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1C3002', fontFamily: "var(--font-victory), sans-serif" }}>
                    ฿{b.price.toFixed(2)}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.5rem', borderTop: '2px dashed #000000' }}>
                <span style={{ fontFamily: "var(--font-milker), sans-serif", fontSize: '1.1rem', fontWeight: 900 }}>ยอดรวมทั้งสิ้น</span>
                <span style={{ fontFamily: "var(--font-victory), sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#1C3002' }}>
                  ฿{order.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                backgroundColor: '#FFDED9',
                padding: '1.25rem',
                borderRadius: '4px',
                border: '2px solid #000000',
                marginBottom: '2rem',
              }}
            >
              {order.book?.cover_url && (
                <img
                  src={order.book.cover_url}
                  alt={order.book.title}
                  style={{ width: '70px', height: '95px', objectFit: 'cover', borderRadius: '2px', border: '2px solid #000000' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: "var(--font-victory), sans-serif", color: '#000000', marginBottom: '4px' }}>
                  {order.book?.title}
                </h3>
                <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B' }}>
                  ผู้แต่ง: {order.book?.author}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1C3002', fontFamily: "var(--font-victory), sans-serif", marginTop: '6px' }}>
                  ฿{order.amount.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Download Box */}
          {isPaid ? (
            <div
              style={{
                backgroundColor: '#E9FFB6',
                border: '2px solid #000000',
                borderRadius: '4px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-milker), sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#1C3002',
                  marginBottom: '0.5rem',
                }}
              >
                DOWNLOAD ACCESS GRANTED
              </h3>
              <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#000000', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                คลิกปุ่มด้านล่างเพื่อรับไฟล์ E-book ตัวอย่าง (Signed URL ปลอดภัย มีอายุจำกัด 2 ชั่วโมง)
              </p>

              {order.books && order.books.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '540px', margin: '0 auto' }}>
                  {order.books.map((b) => {
                    const specificUrl = downloadUrls.find((u) => u.bookId === b.id)?.url || `/api/download/${order.id}?bookId=${b.id}`;
                    return (
                      <a
                        key={b.id}
                        href={specificUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          padding: '0.85rem 1.5rem',
                          fontSize: '1rem',
                          fontFamily: "var(--font-victory), sans-serif",
                          fontWeight: 900,
                          backgroundColor: '#1C3002',
                          color: '#E9FFB6',
                          border: '2px solid #000000',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          transition: 'transform 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        <Download size={18} />
                        <span>ดาวน์โหลด: {b.title} (PDF)</span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <a
                  href={downloadUrl || `/api/download/${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.9rem 2.5rem',
                    fontSize: '1.15rem',
                    fontFamily: "var(--font-victory), sans-serif",
                    fontWeight: 900,
                    backgroundColor: '#1C3002',
                    color: '#E9FFB6',
                    border: '2px solid #000000',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                  }}
                >
                  <Download size={20} />
                  <span>ดาวน์โหลด E-BOOK ตอนนี้ (PDF)</span>
                </a>
              )}

              <div style={{ marginTop: '1rem', fontSize: '0.78rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B' }}>
                * หากเปิดผ่าน WebViewer ของโมบายแอป สามารถเปิดลิงก์ดาวน์โหลดที่ส่งเข้าอีเมลเพื่อดาวน์โหลดลงเครื่อง *
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFDED9',
                border: '2px solid #000000',
                borderRadius: '4px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              <Clock size={36} color="#000000" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontFamily: "var(--font-victory), sans-serif", fontWeight: 900, color: '#000000', marginBottom: '0.5rem' }}>
                คำสั่งซื้อยังไม่ได้รับการชำระเงิน
              </h3>
              <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B', marginBottom: '1.5rem' }}>
                กรุณาไปที่หน้าจำลองชำระเงินเพื่อยืนยันคำสั่งซื้อ
              </p>
              <Link
                href={`/order/${order.id}/payment`}
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "var(--font-victory), sans-serif",
                  fontWeight: 900,
                  textDecoration: 'none',
                }}
              >
                ไปหน้าจำลองชำระเงิน (MOCK PAYMENT)
              </Link>
            </div>
          )}

          {/* Security disclaimer */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              border: '1.5px solid #000000',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ShieldCheck size={18} color="#1C3002" style={{ flexShrink: 0 }} />
            <span>
              <strong>หลักความปลอดภัย:</strong> ลิงก์ E-book ไม่ใช่ไฟล์สาธารณะถาวร โดยระบบสร้าง Signed URL ชั่วคราวให้เฉพาะสถานะ PAID เท่านั้น
            </span>
          </div>

          {/* Navigation buttons */}
          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#1C3002',
                color: '#E9FFB6',
                border: '2px solid #000000',
                borderRadius: '4px',
                fontFamily: "var(--font-victory), sans-serif",
                fontWeight: 900,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <BookOpen size={16} />
              <span>กลับสู่หน้าร้าน</span>
            </Link>
            <Link
              href="/track"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '4px',
                fontFamily: "var(--font-victory), sans-serif",
                fontWeight: 900,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <span>ค้นหาคำสั่งซื้ออื่น</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderStatusPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div
          className="figma-bg-pink-dots"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            fontFamily: 'var(--font-ubuntu-mono), monospace',
            fontSize: '1.2rem',
            color: '#1C3002',
          }}
        >
          กำลังโหลดสถานะคำสั่งซื้อ...
        </div>
      }
    >
      <OrderStatusContent params={params} />
    </Suspense>
  );
}
