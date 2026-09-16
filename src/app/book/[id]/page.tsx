import React from 'react';
import { notFound } from 'next/navigation';
import { fetchBooksByIds } from '@/lib/supabaseServer';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Check, FileText, User } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const books = await fetchBooksByIds([id]);
  const book = books[0] || null;

  if (!book) {
    notFound();
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
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Back button */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1C3002',
            color: '#E9FFB6',
            border: '2px solid #000000',
            borderRadius: '4px',
            padding: '8px 16px',
            fontFamily: "var(--font-victory), sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <ArrowLeft size={18} />
          <span>กลับสู่หน้าร้าน (BACK TO STORE)</span>
        </Link>

        {/* Main Details Grid */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '8px solid #E9FFB6',
            borderRadius: '4px',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          }}
        >
          {/* Book Cover (Figma card style) */}
          <div style={{ maxWidth: '380px', margin: '0 auto', width: '100%' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '10px solid #E9FFB6',
                borderRadius: '4px',
                padding: '1.25rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '380px',
                  backgroundColor: '#D9D9D9',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {book.tags?.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#1C3002',
                    color: '#E9FFB6',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '3px',
                    border: '1px solid #000000',
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                  }}
                >
                  [{tag}]
                </span>
              ))}
            </div>

            <h1
              style={{
                fontFamily: "var(--font-victory), sans-serif",
                fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                fontWeight: 900,
                color: '#000000',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              {book.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontSize: '0.95rem',
                color: '#5E6C4B',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} color="#1C3002" /> {book.author}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="#000000" /> {book.pages} หน้า (PDF)
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#FFDED9',
                padding: '1.25rem',
                borderRadius: '4px',
                border: '2px solid #000000',
                marginBottom: '2rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontFamily: "var(--font-victory), sans-serif",
                  fontWeight: 900,
                  color: '#000000',
                  marginBottom: '0.4rem',
                }}
              >
                คำอธิบายเนื้อหา
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  color: '#000000',
                  lineHeight: 1.6,
                }}
              >
                {book.description}
              </p>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: '2rem' }}>
              <h4
                style={{
                  fontSize: '0.82rem',
                  color: '#000000',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontWeight: 700,
                }}
              >
                // WHAT YOU WILL RECEIVE
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  color: '#000000',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#1C3002" strokeWidth={3} /> ลิงก์ดาวน์โหลดไฟล์ PDF คุณภาพสูง (Signed URL)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#1C3002" strokeWidth={3} /> ส่งอีเมลยืนยันคำสั่งซื้อทันทีหลังจำลองชำระเงิน
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#1C3002" strokeWidth={3} /> ค้นหาและดาวน์โหลดซ้ำได้ผ่านหน้าค้นหาด้วย Order ID + Email
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '1.5rem',
                borderTop: '2.5px solid #000000',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    color: '#5E6C4B',
                    textTransform: 'uppercase',
                  }}
                >
                  PRICE (THB)
                </span>
                <div
                  style={{
                    fontFamily: "var(--font-victory), sans-serif",
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    color: '#1C3002',
                    lineHeight: 1,
                  }}
                >
                  ฿{book.price.toFixed(2)}
                </div>
              </div>

              <Link
                href={`/checkout?bookId=${book.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.9rem 2.2rem',
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "var(--font-gondens), sans-serif",
                  fontSize: '1.5rem',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                }}
              >
                <ShoppingCart size={20} />
                <span>สั่งซื้อ E-BOOK เล่มนี้ (BUY)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
