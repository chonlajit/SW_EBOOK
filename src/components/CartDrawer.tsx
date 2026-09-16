'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, BookOpen } from 'lucide-react';

export default function CartDrawer() {
  const { cart, removeFromCart, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout?from=cart');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderLeft: '6px solid #1C3002',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#213902',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '4px solid #E9FFB6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#E9FFB6',
                color: '#1C3002',
                borderRadius: '4px',
                border: '1.5px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                YOUR CART
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.8rem',
                  color: '#E9FFB6',
                  fontWeight: 700,
                }}
              >
                {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'} IN CART
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            title="ปิดตะกร้า"
            style={{
              backgroundColor: '#FFDED9',
              border: '2px solid #000000',
              borderRadius: '4px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List / Empty State */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            backgroundColor: '#FFDED9',
            backgroundImage: 'radial-gradient(#E9FFB6 1.8px, transparent 1.8px)',
            backgroundSize: '20px 20px',
          }}
        >
          {cart.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '3px dashed #1C3002',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#E9FFB6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #000000',
                  marginBottom: '1rem',
                }}
              >
                <ShoppingBag size={30} color="#1C3002" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#000000',
                  marginBottom: '0.5rem',
                }}
              >
                ตะกร้าสินค้าว่างเปล่า
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.9rem',
                  color: '#5E6C4B',
                  marginBottom: '1.5rem',
                  maxWidth: '240px',
                }}
              >
                คุณยังไม่ได้เพิ่มหนังสือ E-book ลงในตะกร้า เลือกชมหนังสือและกดปุ่ม + CART ได้เลย
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/#bestseller-section');
                }}
                style={{
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  border: '2px solid #000000',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <BookOpen size={16} />
                <span>เลือกดูหนังสือ (BROWSE CATALOG)</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {cart.map(({ book }) => (
                <div
                  key={book.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '3px solid #000000',
                    borderRadius: '6px',
                    padding: '0.9rem',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '60px',
                      height: '80px',
                      backgroundColor: '#D9D9D9',
                      border: '2px solid #E9FFB6',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontFamily: "var(--font-victory), sans-serif",
                        fontSize: '1.05rem',
                        fontWeight: 900,
                        color: '#000000',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={book.title}
                    >
                      {book.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        fontSize: '0.78rem',
                        color: '#5E6C4B',
                        marginBottom: '6px',
                      }}
                    >
                      {book.author}
                    </p>
                    <div
                      style={{
                        fontFamily: "var(--font-victory), sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#1C3002',
                      }}
                    >
                      ฿{book.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(book.id)}
                    title="ลบออกจากตะกร้า"
                    style={{
                      backgroundColor: '#FFDED9',
                      border: '1.5px solid #000000',
                      borderRadius: '4px',
                      padding: '6px',
                      cursor: 'pointer',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'transform 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area with Totals & Checkout Button */}
        {cart.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTop: '3px solid #000000',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Total Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-milker), sans-serif",
                    fontSize: '1.3rem',
                    fontWeight: 900,
                    color: '#000000',
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  TOTAL DUE
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    fontSize: '0.78rem',
                    color: '#5E6C4B',
                    fontWeight: 700,
                  }}
                >
                  (รวม {totalItems} รายการ • DIGITAL DELIVERY FREE)
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '2.1rem',
                  fontWeight: 900,
                  color: '#1C3002',
                }}
              >
                ฿{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>สั่งซื้อทั้งหมด ({totalItems} รายการ)</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={clearCart}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#5E6C4B',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px',
                  textDecoration: 'underline',
                  textAlign: 'center',
                }}
              >
                ล้างสินค้าทั้งหมดในตะกร้า (Clear Cart)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
