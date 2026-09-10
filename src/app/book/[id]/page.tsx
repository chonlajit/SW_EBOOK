import React from 'react';
import { notFound } from 'next/navigation';
import { getBookById } from '@/lib/booksData';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Check, FileText, User } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <Link href="/" className="btn-cyber-outline" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '2rem',
      }}>
        <ArrowLeft size={16} />
        <span>กลับสู่หน้าร้าน</span>
      </Link>

      <div className="tech-box" style={{
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        backgroundColor: '#ffffff',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'start',
      }}>
        {/* Book Cover */}
        <div style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}>
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
            border: '2px solid #0a0a0c',
          }}>
            <img
              src={book.cover_url}
              alt={book.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* Book Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {book.tags?.map((tag) => (
              <span key={tag} style={{
                background: 'rgba(255, 42, 42, 0.08)',
                color: 'var(--accent-red)',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 42, 42, 0.25)',
                fontFamily: 'var(--font-mono)',
              }}>
                [{tag}]
              </span>
            ))}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cyber)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
            fontWeight: 900,
            color: '#0a0a0c',
            lineHeight: 1.25,
            marginBottom: '1rem',
          }}>
            {book.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="var(--accent-red)" /> {book.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="#0a0a0c" /> {book.pages} หน้า (PDF)
            </span>
          </div>

          <div style={{
            background: 'var(--bg-main)',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-tech)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a0a0c', marginBottom: '0.5rem' }}>
              คำอธิบายเนื้อหา
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {book.description}
            </p>
          </div>

          {/* Highlights */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              // WHAT YOU WILL RECEIVE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#0a0a0c' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="var(--accent-red)" /> ลิงก์ดาวน์โหลดไฟล์ PDF คุณภาพสูง (Signed URL)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="var(--accent-red)" /> ส่งอีเมลยืนยันคำสั่งซื้อทันทีหลังจำลองชำระเงิน
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="var(--accent-red)" /> ค้นหาและดาวน์โหลดซ้ำได้ผ่านหน้าค้นหาด้วย Order ID + Email
              </div>
            </div>
          </div>

          {/* Price & Action */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '1.5rem',
            borderTop: '1.5px solid var(--border-tech)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>PRICE (THB)</span>
              <div style={{
                fontFamily: 'var(--font-cyber)',
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#0a0a0c',
                lineHeight: 1,
              }}>
                ฿{book.price.toFixed(2)}
              </div>
            </div>

            <Link
              href={`/checkout?bookId=${book.id}`}
              className="btn-cyber-red"
              style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
            >
              <ShoppingCart size={18} />
              <span>สั่งซื้อ E-BOOK เล่มนี้</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
