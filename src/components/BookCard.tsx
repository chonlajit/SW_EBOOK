import React from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { ArrowUpRight, BookOpen, ShoppingCart } from 'lucide-react';

interface Props {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 1 }: Props) {
  return (
    <div className="tech-box" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '1.25rem',
      backgroundColor: '#ffffff',
    }}>
      {/* Card Header Meta like Image 2 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        marginBottom: '0.75rem',
        borderBottom: '1px dashed var(--border-tech)',
        paddingBottom: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="red-pin"></span>
          <span style={{ fontWeight: 700, color: '#0a0a0c' }}>ITEM.0{index}</span>
        </div>
        <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
          {book.tags?.[0] || 'DIGITAL'}
        </span>
      </div>

      {/* Book Cover Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '115%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(10, 10, 12, 0.1)',
        backgroundColor: '#f1f4f8',
        marginBottom: '1rem',
      }}>
        <img
          src={book.cover_url}
          alt={book.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          {book.author}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-tech)',
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#0a0a0c',
          lineHeight: 1.3,
          marginBottom: '0.5rem',
        }}>
          {book.title}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {book.description}
        </p>

        {/* Price & Action Row */}
        <div style={{
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-tech)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PRICE (THB)
            </div>
            <div style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#0a0a0c',
            }}>
              ฿{book.price.toFixed(2)}
            </div>
          </div>

          <Link
            href={`/checkout?bookId=${book.id}`}
            className="btn-cyber-red"
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.85rem',
            }}
          >
            <ShoppingCart size={15} />
            <span>สั่งซื้อ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
