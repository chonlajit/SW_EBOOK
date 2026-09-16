'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { ShoppingCart, Check, Maximize2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import BookDetailModal from './BookDetailModal';
import { extractDominantColor, isDarkColor } from '@/lib/colorExtractor';

interface Props {
  book: Book;
  index?: number;
  onDelete?: (id: string) => void;
  onEdit?: (book: Book) => void;
}

export default function BookCard({ book, onDelete, onEdit }: Props) {
  const { addToCart, isInCart, setIsCartOpen } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [cardBg, setCardBg] = useState<string>('#FFFFFF');

  useEffect(() => {
    let isMounted = true;
    if (book.cover_url) {
      extractDominantColor(book.cover_url).then((color) => {
        if (isMounted && color) {
          setCardBg(color);
        }
      });
    } else {
      setCardBg('#FFFFFF');
    }
    return () => {
      isMounted = false;
    };
  }, [book.cover_url]);

  const isDark = isDarkColor(cardBg);
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? 'rgba(255, 255, 255, 0.9)' : '#000000';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.45)' : '#000000';

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        style={{
          width: '100%',
          maxWidth: '400px',
          minHeight: '604px',
          backgroundColor: cardBg,
          border: '10px solid #E9FFB6',
          padding: '24px 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          margin: '0 auto',
          cursor: 'pointer',
          transition: 'background-color 0.35s ease, transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.35)';
        }}
      >
        {/* Top: Book Cover Box (282px x 350px, bg #D9D9D9) */}
        <div
          style={{
            width: '282px',
            height: '350px',
            backgroundColor: '#D9D9D9',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
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
                fontSize: '30px',
                color: '#000000',
                fontWeight: 'normal',
                userSelect: 'none',
              }}
            >
              picture.
            </span>
          )}

          {/* Subtle expand indicator badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'rgba(28, 48, 2, 0.9)',
              color: '#E9FFB6',
              border: '1.5px solid #000000',
              borderRadius: '3px',
              padding: '2px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              pointerEvents: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            <Maximize2 size={11} />
            <span>EXPAND</span>
          </div>
        </div>

        {/* Info Container */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 10px' }}>
          {/* Author (artist: Ubuntu_Mono 16px text-black) */}
          <div
            style={{
              textAlign: 'right',
              fontFamily: "var(--font-ubuntu-mono), monospace",
              fontSize: '16px',
              color: secondaryTextColor,
              lineHeight: 1.2,
              marginBottom: '4px',
              transition: 'color 0.3s ease',
            }}
          >
            {book.author ? `by ${book.author}` : 'artist'}
          </div>

          {/* Title (name: Victory_Striker_Sans_Demo 18px text-black) */}
          <h3
            style={{
              fontFamily: "var(--font-victory), sans-serif",
              fontSize: '18px',
              fontWeight: 'normal',
              color: textColor,
              lineHeight: 1.25,
              marginBottom: '4px',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
          >
            {book.title || 'name'}
          </h3>

          {/* Description (Ubuntu_Mono 16px text-black) */}
          <p
            style={{
              fontFamily: "var(--font-ubuntu-mono), monospace",
              fontSize: '16px',
              color: secondaryTextColor,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '8px',
              transition: 'color 0.3s ease',
            }}
          >
            {book.description || 'description'}
          </p>

          {/* Line divider (w-80 outline-1 outline-black) */}
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: dividerColor,
              margin: '4px 0 10px 0',
              transition: 'background-color 0.3s ease',
            }}
          />

          {/* Bottom Row: price (Gondens_DEMO 20px) + 180 (Victory 40px) + THB (Victory 35px) + BUY (Gondens 30px) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
            }}
          >
            {/* Price & Amount */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '40px',
                  color: textColor,
                  lineHeight: 1,
                  transition: 'color 0.3s ease',
                }}
              >
                {book.price || 180}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '20px',
                  color: textColor,
                  lineHeight: 1,
                  transition: 'color 0.3s ease',
                }}
              >
                THB
              </span>
            </div>

            {/* Actions: BUY on top, + CART underneath */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'stretch', minWidth: '96px' }}>
              {/* BUY (Gondens_DEMO 26px text-[#1C3002]) */}
              <Link
                href={`/checkout?bookId=${book.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontFamily: "var(--font-gondens), sans-serif",
                  fontSize: '26px',
                  color: '#1C3002',
                  backgroundColor: '#E9FFB6',
                  border: '2px solid #000000',
                  borderRadius: '3px',
                  padding: '3px 14px',
                  textDecoration: 'none',
                  lineHeight: 1,
                  letterSpacing: '1px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                BUY
              </Link>

              {/* + CART Button (underneath BUY) */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(book);
                  setJustAdded(true);
                  setTimeout(() => setJustAdded(false), 1400);
                }}
                title={isInCart(book.id) ? 'อยู่ในตะกร้าแล้ว (คลิกเพื่อดูตะกร้า)' : 'เพิ่มหนังสือนี้ลงในตะกร้า (Add to cart)'}
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '13px',
                  fontWeight: 900,
                  color: justAdded ? '#1C3002' : '#000000',
                  backgroundColor: justAdded ? '#E9FFB6' : (isInCart(book.id) ? '#FFDED9' : '#FFFFFF'),
                  border: '2px solid #000000',
                  borderRadius: '3px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  lineHeight: 1,
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {justAdded ? (
                  <>
                    <Check size={13} color="#1C3002" strokeWidth={3} />
                    <span>ADDED!</span>
                  </>
                ) : isInCart(book.id) ? (
                  <>
                    <Check size={13} strokeWidth={2.5} />
                    <span>IN CART</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={13} />
                    <span>+ CART</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Book Detail Modal */}
      {isDetailOpen && (
        <BookDetailModal book={book} onClose={() => setIsDetailOpen(false)} />
      )}
    </>
  );
}
