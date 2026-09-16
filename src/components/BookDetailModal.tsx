'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import {
  X,
  ShoppingCart,
  CreditCard,
  Check,
  BookOpen,
  ShieldCheck,
  FileText,
  Sparkles,
  Download,
} from 'lucide-react';

interface Props {
  book: Book;
  onClose: () => void;
}

export default function BookDetailModal({ book, onClose }: Props) {
  const { addToCart, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Modal Dialog Window */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          border: '8px solid #E9FFB6',
          borderRadius: '4px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            backgroundColor: '#1C3002',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #000000',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                backgroundColor: '#E9FFB6',
                color: '#1C3002',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 900,
                letterSpacing: '1px',
              }}
            >
              BOOK SPECIFICATION
            </span>
            <span
              style={{
                color: '#D9D9D9',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
              }}
            >
              FULLSCREEN DETAILS
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFDED9',
              color: '#000000',
              border: '2px solid #000000',
              borderRadius: '3px',
              padding: '4px 12px',
              fontFamily: "var(--font-victory), sans-serif",
              fontSize: '0.95rem',
              fontWeight: 900,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <X size={16} strokeWidth={3} />
            <span>CLOSE [ESC]</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div
          style={{
            padding: '2rem',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Left Column: Book Cover & Purchase Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Book Cover Frame */}
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '282 / 350',
                backgroundColor: '#D9D9D9',
                border: '6px solid #000000',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-gondens), sans-serif",
                    fontSize: '40px',
                    color: '#000000',
                  }}
                >
                  picture.
                </span>
              )}
            </div>

            {/* Price Banner */}
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                backgroundColor: '#FFDED9',
                border: '2.5px solid #000000',
                borderRadius: '4px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-gondens), sans-serif",
                  fontSize: '22px',
                  color: '#000000',
                }}
              >
                price
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: "var(--font-victory), sans-serif",
                    fontSize: '42px',
                    fontWeight: 900,
                    color: '#1C3002',
                    lineHeight: 1,
                  }}
                >
                  {book.price || 180}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-victory), sans-serif",
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#000000',
                    lineHeight: 1,
                  }}
                >
                  THB
                </span>
              </div>
            </div>

            {/* Dual Actions: BUY NOW (top) and + CART (underneath) */}
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {/* BUY NOW Button */}
              <Link
                href={`/checkout?bookId=${book.id}`}
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  border: '2.5px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "var(--font-gondens), sans-serif",
                  fontSize: '28px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <CreditCard size={24} />
                <span>BUY NOW</span>
              </Link>

              {/* + ADD TO CART Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: justAdded ? '#E9FFB6' : (isInCart(book.id) ? '#FFDED9' : '#FFFFFF'),
                  color: justAdded ? '#1C3002' : '#000000',
                  border: '2.5px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {justAdded ? (
                  <>
                    <Check size={18} color="#1C3002" strokeWidth={3} />
                    <span>ADDED TO CART! ✓</span>
                  </>
                ) : isInCart(book.id) ? (
                  <>
                    <Check size={18} strokeWidth={2.5} />
                    <span>IN CART</span>
                  </>
                ) : (
                  <>
                    <span>+ ADD TO CART</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Full Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Author */}
            <div
              style={{
                fontFamily: "var(--font-ubuntu-mono), monospace",
                fontSize: '1rem',
                color: '#5E6C4B',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              AUTHOR: {book.author ? `by ${book.author}` : 'by Anonymous'}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 900,
                color: '#000000',
                lineHeight: 1.15,
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
              }}
            >
              {book.title}
            </h1>

            {/* Badges Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
              <span
                style={{
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <BookOpen size={13} />
                <span>DIGITAL E-BOOK</span>
              </span>

              <span
                style={{
                  backgroundColor: '#E9FFB6',
                  color: '#1C3002',
                  border: '1.5px solid #000000',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FileText size={13} />
                <span>FORMAT: PDF</span>
              </span>

              <span
                style={{
                  backgroundColor: '#FFDED9',
                  color: '#000000',
                  border: '1.5px solid #000000',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={13} />
                <span>INSTANT DOWNLOAD</span>
              </span>
            </div>

            {/* Description Section */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontFamily: "var(--font-victory), sans-serif",
                  fontWeight: 900,
                  color: '#1C3002',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>OVERVIEW &amp; DETAILS</span>
                <div style={{ flex: 1, height: '1.5px', backgroundColor: '#000000' }} />
              </div>

              <div
                style={{
                  fontFamily: "var(--font-ubuntu-mono), monospace",
                  fontSize: '1.02rem',
                  color: '#000000',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-line',
                  backgroundColor: '#f6f8f2',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  padding: '1.25rem',
                }}
              >
                {book.description || 'ไม่มีคำอธิบายสำหรับหนังสือเล่มนี้'}
              </div>
            </div>

            {/* Feature Guarantees Box */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '2px dashed #1C3002',
                borderRadius: '4px',
                padding: '1rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontSize: '0.85rem',
                color: '#1C3002',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#1C3002" />
                <span><strong>ระบบความปลอดภัย:</strong> สิทธิ์ดาวน์โหลดผ่าน Signed URL ปลอดภัย มีอายุจำกัด</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} color="#1C3002" />
                <span><strong>ดาวน์โหลดได้ทันที:</strong> สามารถดาวน์โหลดได้ทันทีหลังชำระเงินจำลองสำเร็จ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
