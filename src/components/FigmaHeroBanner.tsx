'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Book } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import BookDetailModal from './BookDetailModal';

interface Props {
  books: Book[];
}

export default function FigmaHeroBanner({ books }: Props) {
  const { addToCart, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const total = books.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setAnimating(false), 300);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setAnimating(false), 300);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, total]);

  const currentBook = books[currentIndex] || books[0];
  const nextBook = books[(currentIndex + 1) % (total || 1)] || books[0];

  return (
    <section
      className="figma-bg-pink-dots"
      style={{
        padding: '1.5rem 1rem 1.5rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1440px',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(320px, 0.75fr)',
          gap: '2rem',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Left Column: Book Vector + CJ SHOP + Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 2 }}>
          {/* Fanned Out Open Book Vector directly from Figma */}
          <div style={{ width: '251px', height: '206px', position: 'relative' }}>
            <img
              src="/figma/book-vector.svg"
              alt="CJ Book Icon"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {/* Giant Title: CJ SHOP (font: Milker, 200px in Figma) */}
          <div style={{ lineHeight: 0.85 }}>
            <h1
              style={{
                fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
                fontSize: 'clamp(4.5rem, 10.5vw, 12rem)',
                fontWeight: 'normal',
                color: '#000000',
                letterSpacing: '-2px',
                textTransform: 'uppercase',
                margin: 0,
                padding: 0,
              }}
            >
              CJ SHOP
            </h1>
          </div>

          {/* Subtitle / Tagline from Figma: Inter 28pt SemiBold 25px */}
          <div
            style={{
              fontFamily: "'Inter_28pt', 'Inter', sans-serif",
              fontSize: 'clamp(1.1rem, 2vw, 25px)',
              fontWeight: 600,
              color: '#000000',
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              flexWrap: 'wrap',
              letterSpacing: '0.2px',
              marginTop: '0.25rem',
            }}
          >
            <span>Platform to sale </span>
            <span style={{ color: '#E9FFB6', WebkitTextStroke: '0.7px #000000' }}>Books</span>
            <span> for </span>
            <span style={{ color: '#E9FFB6', WebkitTextStroke: '0.7px #000000' }}>DEVELOPER!!!!</span>
          </div>
        </div>

        {/* Right Column: 2 Overlapping Cards (pic2 403x287 & pic1 378x287) with Live Book Slider */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            position: 'relative',
            minHeight: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          {/* Card 1: pic2 (top-left offset: 403px x 287px, border 5px #e9ffb6, bg #d9d9d9) */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: 'clamp(260px, 80%, 403px)',
              height: '287px',
              backgroundColor: '#D9D9D9',
              border: '5px solid #E9FFB6',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              opacity: 0.95,
              zIndex: 1,
            }}
          >
            {nextBook?.cover_url ? (
              <img
                src={nextBook.cover_url}
                alt={nextBook.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(15%) brightness(0.95)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontFamily: "var(--font-gondens), sans-serif",
                  fontSize: '30px',
                }}
              >
                picture.
              </div>
            )}
          </div>

          {/* Card 2: pic1 (bottom-right offset: 378px x 287px, border 5px #e9ffb6, bg #d9d9d9) */}
          <div
            onClick={() => currentBook && setIsDetailOpen(true)}
            style={{
              position: 'relative',
              width: 'clamp(260px, 85%, 378px)',
              height: '287px',
              backgroundColor: '#D9D9D9',
              border: '5px solid #E9FFB6',
              boxShadow: '0 16px 36px rgba(0,0,0,0.22)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1rem',
              transform: animating ? 'translate(45px, 40px) scale(0.98)' : 'translate(40px, 35px) scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.2, 1, 0.3, 1)',
              zIndex: 2,
              cursor: 'pointer',
            }}
          >
            {/* Active Book Cover as subtle backdrop */}
            {currentBook?.cover_url && (
              <img
                src={currentBook.cover_url}
                alt={currentBook.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.35,
                  zIndex: 0,
                }}
              />
            )}

            {/* Top Slide Meta Tag */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  background: '#000000',
                  color: '#E9FFB6',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  fontFamily: "var(--font-ubuntu-mono), monospace",
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                FEATURED • {currentIndex + 1}/{total || 1}
              </span>

              {/* Slider Navigation Buttons */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  title="ก่อนหน้า"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  title="ถัดไป"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Book Info & Quick Buy Button */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '0.75rem 0.9rem',
                borderRadius: '4px',
                border: '1.5px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-victory), sans-serif",
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#000000',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentBook ? currentBook.title : 'หนังสือตัวอย่าง'}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: "var(--font-ubuntu-mono), monospace",
                    color: '#000000',
                  }}
                >
                  {currentBook ? currentBook.author : 'artist'} • {currentBook ? currentBook.price : 180} THB
                </div>
              </div>

              {currentBook && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'stretch', flexShrink: 0 }}>
                  <Link
                    href={`/checkout?bookId=${currentBook.id}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: '#1C3002',
                      color: '#E9FFB6',
                      border: '1.5px solid #000',
                      padding: '3px 10px',
                      borderRadius: '3px',
                      fontFamily: "var(--font-gondens), sans-serif",
                      fontSize: '1.2rem',
                      lineHeight: 1,
                      letterSpacing: '1px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    BUY
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(currentBook);
                      setJustAdded(true);
                      setTimeout(() => setJustAdded(false), 1400);
                    }}
                    title={isInCart(currentBook.id) ? 'อยู่ในตะกร้าแล้ว' : 'เพิ่มลงตะกร้า'}
                    style={{
                      backgroundColor: justAdded ? '#E9FFB6' : (isInCart(currentBook.id) ? '#FFDED9' : '#FFFFFF'),
                      color: justAdded ? '#1C3002' : '#000000',
                      border: '1.5px solid #000',
                      padding: '3px 6px',
                      borderRadius: '3px',
                      fontFamily: "var(--font-victory), sans-serif",
                      fontSize: '0.82rem',
                      fontWeight: 900,
                      lineHeight: 1,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'transform 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {justAdded ? (
                      <>
                        <Check size={11} color="#1C3002" strokeWidth={3} />
                        <span>ADDED!</span>
                      </>
                    ) : isInCart(currentBook.id) ? (
                      <>
                        <Check size={11} strokeWidth={2.5} />
                        <span>IN CART</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={11} />
                        <span>+ CART</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Book Detail Modal */}
      {isDetailOpen && currentBook && (
        <BookDetailModal book={currentBook} onClose={() => setIsDetailOpen(false)} />
      )}
    </section>
  );
}
