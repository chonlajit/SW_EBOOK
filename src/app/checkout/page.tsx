'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { INITIAL_BOOKS } from '@/lib/booksData';
import Link from 'next/link';
import { ArrowLeft, User, Mail, CreditCard, ShoppingCart } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialBookId = searchParams.get('bookId') || INITIAL_BOOKS[0].id;
  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedBook = INITIAL_BOOKS.find((b) => b.id === selectedBookId) || INITIAL_BOOKS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุลของผู้ซื้อ');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMsg('กรุณากรอกอีเมลที่ถูกต้องเพื่อรับลิงก์ดาวน์โหลด E-book');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: selectedBook.id,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
      }

      router.push(`/order/${data.order.id}/payment`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ไม่สามารถสร้างคำสั่งซื้อได้';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '1050px' }}>
      <Link href="/" className="btn-cyber-outline" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '2rem',
      }}>
        <ArrowLeft size={16} />
        <span>กลับสู่หน้าร้าน</span>
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontWeight: 700, marginBottom: '4px' }}>
          // STEP 02: ORDER SPECIFICATION
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cyber)',
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#0a0a0c',
          textTransform: 'uppercase',
        }}>
          CHECKOUT &amp; ORDER
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          กรอกข้อมูลผู้รับและตรวจสอบรายการสั่งซื้อ (สถานะเริ่มต้นจะถูกบันทึกเป็น PENDING)
        </p>
      </div>

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Checkout Form Box */}
        <div className="tech-box" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1.5px solid #0a0a0c',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#0a0a0c',
            }}>
              CUSTOMER PROFILE
            </h2>
            <span className="red-pin"></span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a0a0c', marginBottom: '0.5rem' }}>
                เลือก E-book ที่ต้องการสั่งซื้อ
              </label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="form-input-tech"
                style={{ cursor: 'pointer' }}
              >
                {INITIAL_BOOKS.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} (฿{book.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a0a0c', marginBottom: '0.5rem' }}>
                ชื่อ - นามสกุล ผู้รับ <span style={{ color: 'var(--accent-red)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย สดใส"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="form-input-tech"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a0a0c', marginBottom: '0.5rem' }}>
                อีเมลสำหรับรับลิงก์ดาวน์โหลด <span style={{ color: 'var(--accent-red)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="email"
                  required
                  placeholder="เช่น email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="form-input-tech"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                * ลิงก์ดาวน์โหลดและสถานะคำสั่งซื้อจะถูกส่งไปยังอีเมลนี้
              </small>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-red"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? (
                <span>กำลังสร้างคำสั่งซื้อ...</span>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>ไปหน้าจำลองชำระเงิน (MOCK PAYMENT)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Box */}
        <div className="tech-box" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1.5px solid #0a0a0c',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#0a0a0c',
            }}>
              ORDER SUMMARY
            </h3>
            <span className="red-pin"></span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-tech)' }}>
            <img
              src={selectedBook.cover_url}
              alt={selectedBook.title}
              style={{ width: '75px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-tech)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a0a0c', marginBottom: '4px', lineHeight: 1.3 }}>
                {selectedBook.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ผู้แต่ง: {selectedBook.author}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 700, marginTop: '6px' }}>
                [ DIGITAL E-BOOK • PDF ]
              </div>
            </div>
          </div>

          <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid var(--border-tech)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span>ราคาสินค้า</span>
              <span style={{ fontWeight: 700, color: '#0a0a0c' }}>฿{selectedBook.price.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span>ค่าจัดส่งทางดิจิทัล</span>
              <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>FREE (฿0.00)</span>
            </div>
          </div>

          <div style={{ padding: '1.25rem 0 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: '#0a0a0c', fontSize: '1rem', fontFamily: 'var(--font-cyber)' }}>
              TOTAL DUE
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0a0a0c', fontFamily: 'var(--font-cyber)' }}>
              ฿{selectedBook.price.toFixed(2)}
            </span>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '0.85rem',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-tech)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}>
            <strong style={{ color: '#0a0a0c' }}>INITIAL STATUS:</strong> PENDING (รอการจำลองชำระเงิน)
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem', textAlign: 'center' }}>กำลังโหลดหน้าสั่งซื้อ...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
