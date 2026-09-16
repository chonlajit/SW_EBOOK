'use client';

import React from 'react';
import { INITIAL_BOOKS } from '@/lib/booksData';
import { useBooks } from '@/context/BooksContext';
import FigmaHeroBanner from '@/components/FigmaHeroBanner';
import KnowledgeAlertTicker from '@/components/KnowledgeAlertTicker';
import BookCard from '@/components/BookCard';

export default function HomePage() {
  const { books, searchTerm, setSearchTerm } = useBooks();

  // Use real books from BooksContext/Supabase/data/books.json, fallback to initial books
  const activeBooks = books && books.length > 0 ? books : INITIAL_BOOKS;

  const filteredBooks = activeBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--figma-pink)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* 1. HERO BANNER (Figma bannersection with book vector & dual-card live book slider) */}
      <FigmaHeroBanner books={activeBooks} />

      {/* 2. KNOWLEDGE ALERT TICKER (Figma khowledge alert vector ribbon) */}
      <KnowledgeAlertTicker />

      {/* 4. BEST SELLER SECTION (Figma Bestsellersection with vector background and 3 cards) */}
      <section
        id="bestseller-section"
        style={{
          backgroundColor: '#1C3002',
          position: 'relative',
          padding: '1.5rem 1rem 5rem 1rem',
          overflow: 'hidden',
          minHeight: '850px',
        }}
      >
        {/* Background Vector: bg-bestseller.svg (exact repeated BEST SELLER watermark from Figma) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '2356px',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.9,
            overflow: 'hidden',
          }}
        >
          <img
            src="/figma/bg-bestseller.svg"
            alt=""
            style={{
              width: '200%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Foreground Content Container */}
        <div
          className="container"
          style={{
            maxWidth: '1440px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Main Pink Header: BEST SELLER (font: Gondens_DEMO, text-[150px], text-[#ffded9]) */}
          <div style={{ textAlign: 'left', marginBottom: '2.5rem', paddingLeft: '1rem', marginTop: '2rem' }}>
            <h2
              style={{
                fontFamily: "var(--font-gondens), 'Bebas Neue', sans-serif",
                fontSize: 'clamp(4.5rem, 10.5vw, 150px)',
                fontWeight: 'normal',
                color: '#FFDED9',
                letterSpacing: '1px',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                margin: 0,
                userSelect: 'none',
              }}
            >
              BEST SELLER
            </h2>
          </div>

          {/* 3 Columns Book Cards Grid */}
          {filteredBooks.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
                justifyContent: 'center',
                alignItems: 'stretch',
              }}
            >
              {filteredBooks.map((book, index) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={index + 1}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: '#ffffff',
                border: '10px solid #E9FFB6',
                borderRadius: '8px',
                maxWidth: '600px',
                margin: '2rem auto',
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-ubuntu-mono), monospace",
                  fontSize: '1.2rem',
                  color: '#000000',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                ไม่พบหนังสือที่ค้นหา &ldquo;{searchTerm}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  background: '#1C3002',
                  color: '#E9FFB6',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ล้างคำค้นหา
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
