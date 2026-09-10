'use client';

import React, { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/lib/types';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { CheckCircle2, Download, Mail, ArrowRight, ShieldCheck, Clock, RefreshCw, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default function OrderStatusPage({ params }: Props) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const searchParams = useSearchParams();
  const justPaid = searchParams.get('paid') === 'true';

  const [order, setOrder] = useState<Order | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
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
      <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>
        <RefreshCw className="animate-spin" size={36} style={{ margin: '0 auto 1rem auto', color: 'var(--accent-red)' }} />
        <p>กำลังโหลดสถานะคำสั่งซื้อ...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>ไม่พบข้อมูลคำสั่งซื้อ</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{errorMsg}</p>
        <Link href="/" className="btn-cyber-outline">
          กลับสู่หน้าร้าน
        </Link>
      </div>
    );
  }

  const isPaid = order.status === 'PAID';

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: '850px' }}>
      {/* Celebration Banner when PAID */}
      {isPaid && (
        <div style={{
          background: '#0d0e12',
          border: '2px solid var(--accent-red)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            color: '#ffffff',
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cyber)',
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.5px',
            marginBottom: '0.5rem',
          }}>
            ORDER VERIFIED • STATUS: PAID
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.25rem auto' }}>
            การชำระเงินจำลองเสร็จสมบูรณ์ ระบบได้ออกลิงก์ดาวน์โหลด E-book ปลอดภัยสำหรับคุณแล้ว
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.85rem',
            color: '#ffffff',
          }}>
            <Mail size={16} color="var(--accent-red)" />
            <span>ส่งลิงก์ยืนยันไปยัง: <strong>{order.customer_email}</strong></span>
          </div>
        </div>
      )}

      {/* Main Order Details Card */}
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
              #{order.id}
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Book summary item */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center',
          background: 'var(--bg-main)',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-tech)',
          marginBottom: '2rem',
        }}>
          {order.book?.cover_url && (
            <img
              src={order.book.cover_url}
              alt={order.book.title}
              style={{ width: '70px', height: '95px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-tech)' }}
            />
          )}
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0a0a0c', marginBottom: '4px' }}>
              {order.book?.title}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ผู้แต่ง: {order.book?.author}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0a0a0c', fontFamily: 'var(--font-cyber)', marginTop: '6px' }}>
              ฿{order.amount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Download Box */}
        {isPaid ? (
          <div style={{
            background: 'rgba(255, 42, 42, 0.05)',
            border: '1.5px solid var(--accent-red)',
            borderRadius: '14px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '1.25rem',
              fontWeight: 900,
              color: '#0a0a0c',
              marginBottom: '0.5rem',
            }}>
              DOWNLOAD ACCESS GRANTED
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              คลิกปุ่มด้านล่างเพื่อรับไฟล์ E-book ตัวอย่าง (Signed URL ปลอดภัย มีอายุจำกัด 2 ชั่วโมง)
            </p>

            <a
              href={downloadUrl || `/api/download/${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber-red"
              style={{
                padding: '0.9rem 2.5rem',
                fontSize: '1rem',
              }}
            >
              <Download size={20} />
              <span>ดาวน์โหลด E-BOOK ตอนนี้ (PDF)</span>
            </a>

            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              * หากเปิดผ่าน WebViewer ของโมบายแอป สามารถเปิดลิงก์ดาวน์โหลดที่ส่งเข้าอีเมลเพื่อดาวน์โหลดลงเครื่อง *
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--border-tech)',
            borderRadius: '14px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            <Clock size={36} color="#0a0a0c" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0a0a0c', marginBottom: '0.5rem' }}>
              คำสั่งซื้อยังไม่ได้รับการชำระเงิน
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              กรุณาไปที่หน้าจำลองชำระเงินเพื่อยืนยันคำสั่งซื้อ
            </p>
            <Link href={`/order/${order.id}/payment`} className="btn-cyber-red">
              ไปหน้าจำลองชำระเงิน (Mock Payment)
            </Link>
          </div>
        )}

        {/* Security disclaimer */}
        <div style={{
          padding: '0.85rem 1.25rem',
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
          <span>
            <strong>หลักความปลอดภัย:</strong> ลิงก์ E-book ไม่ใช่ไฟล์สาธารณะถาวร โดยระบบสร้าง Signed URL ชั่วคราวให้เฉพาะสถานะ PAID เท่านั้น
          </span>
        </div>

        {/* Navigation buttons */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <Link href="/" className="btn-cyber-outline">
            <BookOpen size={16} />
            <span>กลับสู่หน้าร้าน</span>
          </Link>
          <Link href="/track" className="btn-cyber-outline">
            <span>ค้นหาคำสั่งซื้ออื่น</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
