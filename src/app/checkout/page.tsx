'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { INITIAL_BOOKS } from '@/lib/booksData';
import { useBooks } from '@/context/BooksContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Lock,
  ShoppingCart,
  Trash2,
  Package,
} from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { books } = useBooks();
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart, totalPrice, totalItems, setIsCartOpen } = useCart();

  const activeBooks = books.length > 0 ? books : INITIAL_BOOKS;
  const bookParam = searchParams.get('bookId');
  const fromParam = searchParams.get('from');

  // Mode resolution:
  // 1. If bookParam is specified: Single-book direct purchase (locked from store as requested)
  // 2. If fromParam === 'cart' OR (!bookParam && cart.length > 0): Cart purchase mode
  // 3. If !bookParam and cart is empty: Single-book purchase mode with unlocked dropdown
  const isDirectBookBuy = Boolean(bookParam && activeBooks.some((b) => b.id === bookParam));
  const isCartMode = !isDirectBookBuy && (fromParam === 'cart' || cart.length > 0);

  const isLockedFromStore = isDirectBookBuy;
  const [selectedBookId, setSelectedBookId] = useState(isLockedFromStore ? (bookParam || '') : '');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync if URL bookParam changes
  React.useEffect(() => {
    if (bookParam && activeBooks.some((b) => b.id === bookParam)) {
      setSelectedBookId(bookParam);
    }
  }, [bookParam, activeBooks]);

  // Auto pre-fill when user loads
  React.useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
    }
  }, [user]);

  const selectedBook = activeBooks.find((b) => b.id === selectedBookId) || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isCartMode) {
      if (cart.length === 0) {
        setErrorMsg('ตะกร้าสินค้าว่างเปล่า กรุณาเลือกสินค้าก่อนดำเนินการต่อ');
        return;
      }
    } else {
      if (!selectedBook) {
        setErrorMsg('กรุณาเลือก E-book ที่ต้องการสั่งซื้อก่อนดำเนินการต่อ');
        return;
      }
    }

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
      const payload = isCartMode
        ? {
            book_ids: cart.map((i) => i.book.id),
            customer_name: customerName.trim(),
            customer_email: customerEmail.trim().toLowerCase(),
          }
        : {
            book_id: selectedBook!.id,
            customer_name: customerName.trim(),
            customer_email: customerEmail.trim().toLowerCase(),
          };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cjshop_checkout_email', customerEmail.trim().toLowerCase());
      }

      if (isCartMode) {
        clearCart();
      }

      router.push(`/order/${data.order.id}/payment`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ไม่สามารถสร้างคำสั่งซื้อได้';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const finalAmount = isCartMode ? totalPrice : (selectedBook ? selectedBook.price : 0);
  const isSubmitDisabled = loading || (isCartMode ? cart.length === 0 : !selectedBook);

  return (
    <div
      className="figma-bg-pink-dots"
      style={{
        flex: 1,
        padding: '2.5rem 1rem 5rem 1rem',
        minHeight: '100%',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <ArrowLeft size={18} />
            <span>BACK TO STORE</span>
          </Link>

          {/* Mode Switcher / Info badge */}
          {isDirectBookBuy && cart.length > 0 && (
            <Link
              href="/checkout?from=cart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#E9FFB6',
                color: '#1C3002',
                border: '2px solid #000000',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <ShoppingCart size={16} />
              <span>มี {cart.length} รายการในตะกร้า (คลิกเพื่อสั่งซื้อรวม) →</span>
            </Link>
          )}

          {isCartMode && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '2px solid #000000',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ShoppingCart size={16} />
              <span>เปิดดูตะกร้า ({totalItems} ชิ้น)</span>
            </button>
          )}
        </div>

        {/* Page Header Area */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#000000',
              color: '#E9FFB6',
              padding: '3px 10px',
              borderRadius: '3px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '0.5rem',
            }}
          >
            {isCartMode ? 'CART CHECKOUT' : 'ORDER SPECIFICATION'}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 900,
              color: '#000000',
              textTransform: 'uppercase',
              margin: '0.25rem 0',
              lineHeight: 1,
              letterSpacing: '-1px',
            }}
          >
            {isCartMode ? 'CART ORDER & CHECKOUT' : 'CHECKOUT & ORDER'}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#1C3002',
              fontSize: '1.05rem',
              fontWeight: 700,
            }}
          >
            {isCartMode
              ? `สั่งซื้อพร้อมกัน ${cart.length} รายการจากตะกร้าสินค้า`
              : 'กรอกข้อมูลผู้รับและตรวจสอบรายการสั่งซื้อ'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#FFDED9',
              border: '3px solid #000000',
              borderRadius: '6px',
              color: '#000000',
              marginBottom: '2rem',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Dual Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Card 1: Customer Profile Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '8px solid #E9FFB6',
              borderRadius: '4px',
              padding: '2rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '2.5px solid #000000',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#000000',
                  letterSpacing: '0.5px',
                  margin: 0,
                }}
              >
                CUSTOMER PROFILE
              </h2>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#1C3002',
                  display: 'inline-block',
                }}
              />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Product Selection Mode UI */}
              {isCartMode ? (
                /* Cart mode product summary in form */
                <div style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.6rem',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        fontWeight: 700,
                        color: '#000000',
                      }}
                    >
                      รายการในตะกร้า ({cart.length} รายการ){' '}
                      <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
                    </label>
                    <Link
                      href="/#bestseller-section"
                      style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        color: '#1C3002',
                        textDecoration: 'underline',
                        fontWeight: 700,
                      }}
                    >
                      + เพิ่มสินค้าอื่น
                    </Link>
                  </div>

                  {cart.length === 0 ? (
                    <div
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#FFDED9',
                        border: '2px dashed #000000',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                      }}
                    >
                      <ShoppingBag size={32} style={{ margin: '0 auto 8px auto', color: '#1C3002' }} />
                      <p style={{ fontWeight: 700, color: '#000000', margin: '0 0 6px 0' }}>
                        ยังไม่มีสินค้าในตะกร้า
                      </p>
                      <Link
                        href="/#bestseller-section"
                        style={{
                          fontSize: '0.82rem',
                          color: '#1C3002',
                          textDecoration: 'underline',
                          fontWeight: 700,
                        }}
                      >
                        ← กลับไปเลือกซื้อหนังสือหน้าร้าน
                      </Link>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        maxHeight: '260px',
                        overflowY: 'auto',
                        paddingRight: '4px',
                      }}
                    >
                      {cart.map((item) => (
                        <div
                          key={item.book.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            padding: '8px 12px',
                            backgroundColor: '#f6f8f2',
                            border: '1.5px solid #000000',
                            borderRadius: '4px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            {item.book.cover_url && (
                              <img
                                src={item.book.cover_url}
                                alt={item.book.title}
                                style={{
                                  width: '32px',
                                  height: '44px',
                                  objectFit: 'cover',
                                  borderRadius: '2px',
                                  border: '1px solid #000000',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                                  color: '#000000',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {item.book.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#5E6C4B',
                                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                                }}
                              >
                                ฿{item.book.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.book.id)}
                            title="ลบออกจากตะกร้า"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#5E6C4B',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '2px',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1C3002')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#5E6C4B')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Single book mode dropdown / locked view */
                <div style={{ marginBottom: '1.4rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <label
                      htmlFor="book-select"
                      style={{
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        fontWeight: 700,
                        color: '#000000',
                      }}
                    >
                      เลือก E-book ที่ต้องการสั่งซื้อ <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
                    </label>
                    {isLockedFromStore && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-ubuntu-mono), monospace',
                          fontWeight: 700,
                          color: '#1C3002',
                          backgroundColor: '#E9FFB6',
                          border: '1.5px solid #000000',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        <Lock size={12} />
                        <span>เลือกล่วงหน้าจากหน้าร้านแล้ว</span>
                      </span>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <select
                      id="book-select"
                      value={selectedBookId}
                      onChange={(e) => setSelectedBookId(e.target.value)}
                      disabled={isLockedFromStore}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: isLockedFromStore ? '#f3f5ed' : '#ffffff',
                        border: '2px solid #000000',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: isLockedFromStore ? '#1C3002' : selectedBookId ? '#000000' : '#5E6C4B',
                        cursor: isLockedFromStore ? 'not-allowed' : 'pointer',
                        outline: 'none',
                      }}
                    >
                      {!isLockedFromStore && (
                        <option value="">-- กรุณาเลือก E-book ที่ต้องการสั่งซื้อ --</option>
                      )}
                      {activeBooks.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title} (฿{book.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {isLockedFromStore ? (
                    <div style={{ marginTop: '6px' }}>
                      <Link
                        href="/#bestseller-section"
                        style={{
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-ubuntu-mono), monospace',
                          color: '#1C3002',
                          textDecoration: 'underline',
                          fontWeight: 700,
                        }}
                      >
                        ← ต้องการเลือกเล่มอื่น? คลิกเพื่อกลับไปหน้าร้าน
                      </Link>
                    </div>
                  ) : (
                    <small
                      style={{
                        color: '#5E6C4B',
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        fontSize: '0.78rem',
                        marginTop: '6px',
                        display: 'block',
                      }}
                    >
                      * กรุณาเลือกหนังสือเล่มที่ต้องการสั่งซื้อจากรายการด้านบน
                    </small>
                  )}
                </div>
              )}

              {/* Customer Name */}
              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    fontWeight: 700,
                    color: '#000000',
                    marginBottom: '0.5rem',
                  }}
                >
                  ชื่อ - นามสกุล ผู้รับ <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <UserIcon
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#000000',
                    }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="เช่น สมชาย สดใส"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      backgroundColor: '#ffffff',
                      border: '2px solid #000000',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-ubuntu-mono), monospace',
                      fontSize: '0.95rem',
                      color: '#000000',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Customer Email */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    fontWeight: 700,
                    color: '#000000',
                    marginBottom: '0.5rem',
                  }}
                >
                  อีเมลสำหรับรับลิงก์ดาวน์โหลด <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#000000',
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="เช่น email@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      backgroundColor: '#ffffff',
                      border: '2px solid #000000',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-ubuntu-mono), monospace',
                      fontSize: '0.95rem',
                      color: '#000000',
                      outline: 'none',
                    }}
                  />
                </div>
                <small
                  style={{
                    color: '#5E6C4B',
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    fontSize: '0.78rem',
                    marginTop: '6px',
                    display: 'block',
                  }}
                >
                  * ลิงก์ดาวน์โหลดและสถานะคำสั่งซื้อจะถูกส่งไปยังอีเมลนี้
                </small>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: isSubmitDisabled ? '#5E6C4B' : '#1C3002',
                  color: '#E9FFB6',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                  transition: 'transform 0.15s ease',
                  opacity: isSubmitDisabled ? 0.6 : 1,
                }}
                onMouseEnter={(e) => !isSubmitDisabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !isSubmitDisabled && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? (
                  <span>กำลังสร้างคำสั่งซื้อ...</span>
                ) : isCartMode ? (
                  cart.length === 0 ? (
                    <span>กรุณาเลือกสินค้าลงตะกร้าก่อน</span>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>ไปหน้าจำลองชำระเงิน (฿{totalPrice.toFixed(2)})</span>
                    </>
                  )
                ) : !selectedBook ? (
                  <span>กรุณาเลือก E-BOOK ก่อนชำระเงิน</span>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>ไปหน้าจำลองชำระเงิน (MOCK PAYMENT)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card 2: Order Summary */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '8px solid #E9FFB6',
              borderRadius: '4px',
              padding: '2rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '2.5px solid #000000',
                marginBottom: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-victory), sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#000000',
                  letterSpacing: '0.5px',
                  margin: 0,
                }}
              >
                ORDER SUMMARY
              </h3>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#1C3002',
                  display: 'inline-block',
                }}
              />
            </div>

            {/* Content based on mode */}
            {isCartMode ? (
              cart.length > 0 ? (
                <>
                  {/* Cart Items List in Summary */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1.5rem',
                      borderBottom: '1.5px dashed #000000',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      paddingRight: '4px',
                    }}
                  >
                    {cart.map((item) => (
                      <div
                        key={item.book.id}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '50px',
                            height: '68px',
                            backgroundColor: '#D9D9D9',
                            border: '2px solid #E9FFB6',
                            borderRadius: '2px',
                            flexShrink: 0,
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={item.book.cover_url}
                            alt={item.book.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontFamily: "var(--font-victory), sans-serif",
                              fontSize: '1rem',
                              fontWeight: 900,
                              color: '#000000',
                              marginBottom: '2px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.book.title}
                          </h4>
                          <p
                            style={{
                              fontFamily: 'var(--font-ubuntu-mono), monospace',
                              fontSize: '0.78rem',
                              color: '#5E6C4B',
                              margin: 0,
                            }}
                          >
                            {item.book.author}
                          </p>
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-victory), sans-serif",
                            fontWeight: 900,
                            color: '#1C3002',
                            fontSize: '1.1rem',
                          }}
                        >
                          ฿{item.book.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Details */}
                  <div
                    style={{
                      fontFamily: 'var(--font-ubuntu-mono), monospace',
                      fontSize: '0.95rem',
                      color: '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>ราคารวม ({cart.length} เล่ม)</span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: "var(--font-victory), sans-serif",
                          fontSize: '1.2rem',
                        }}
                      >
                        ฿{totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1C3002' }}>
                      <span>ค่าจัดส่งทางดิจิทัล</span>
                      <span style={{ fontWeight: 700 }}>FREE [฿0.00]</span>
                    </div>
                  </div>

                  {/* Total Due Callout */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      paddingTop: '1.25rem',
                      borderTop: '2.5px solid #000000',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-milker), sans-serif",
                        fontSize: '1.6rem',
                        fontWeight: 900,
                        color: '#000000',
                      }}
                    >
                      TOTAL DUE
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-victory), sans-serif",
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        color: '#1C3002',
                      }}
                    >
                      ฿{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    backgroundColor: '#FFDED9',
                    border: '2.5px dashed #000000',
                    borderRadius: '4px',
                    marginBottom: '1.5rem',
                  }}
                >
                  <ShoppingBag size={42} style={{ margin: '0 auto 10px', color: '#1C3002' }} />
                  <div
                    style={{
                      fontFamily: "var(--font-victory), sans-serif",
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      color: '#1C3002',
                      marginBottom: '0.4rem',
                    }}
                  >
                    ตะกร้าสินค้าว่างเปล่า
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-ubuntu-mono), monospace',
                      fontSize: '0.88rem',
                      color: '#5E6C4B',
                      margin: '0 0 1rem 0',
                    }}
                  >
                    กรุณากลับไปเลือก E-book ที่ต้องการสั่งซื้อลงในตะกร้า
                  </p>
                  <Link
                    href="/#bestseller-section"
                    style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      backgroundColor: '#1C3002',
                      color: '#E9FFB6',
                      border: '1.5px solid #000000',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-ubuntu-mono), monospace',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    ← เลือกซื้อหนังสือ
                  </Link>
                </div>
              )
            ) : selectedBook ? (
              /* Single book summary */
              <>
                <div
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1.5px dashed #000000',
                  }}
                >
                  <div
                    style={{
                      width: '85px',
                      height: '115px',
                      backgroundColor: '#D9D9D9',
                      border: '3px solid #E9FFB6',
                      borderRadius: '2px',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={selectedBook.cover_url}
                      alt={selectedBook.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontFamily: "var(--font-victory), sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#000000',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {selectedBook.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        fontSize: '0.85rem',
                        color: '#5E6C4B',
                        marginBottom: '0.5rem',
                      }}
                    >
                      ผู้แต่ง: {selectedBook.author}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#1C3002',
                        color: '#E9FFB6',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-ubuntu-mono), monospace',
                        fontWeight: 700,
                      }}
                    >
                      DIGITAL E-BOOK • PDF
                    </span>
                  </div>
                </div>

                {/* Pricing Details */}
                <div
                  style={{
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    fontSize: '0.95rem',
                    color: '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ราคาสินค้า</span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontFamily: "var(--font-victory), sans-serif",
                        fontSize: '1.2rem',
                      }}
                    >
                      ฿{selectedBook.price.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1C3002' }}>
                    <span>ค่าจัดส่งทางดิจิทัล</span>
                    <span style={{ fontWeight: 700 }}>FREE [฿0.00]</span>
                  </div>
                </div>

                {/* Total Due Callout */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingTop: '1.25rem',
                    borderTop: '2.5px solid #000000',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-milker), sans-serif",
                      fontSize: '1.6rem',
                      fontWeight: 900,
                      color: '#000000',
                    }}
                  >
                    TOTAL DUE
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-victory), sans-serif",
                      fontSize: '2.2rem',
                      fontWeight: 900,
                      color: '#1C3002',
                    }}
                  >
                    ฿{selectedBook.price.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: '#FFDED9',
                  border: '2.5px dashed #000000',
                  borderRadius: '4px',
                  marginBottom: '1.5rem',
                }}
              >
                <ShoppingBag size={42} style={{ margin: '0 auto 10px', color: '#1C3002' }} />
                <div
                  style={{
                    fontFamily: "var(--font-victory), sans-serif",
                    fontSize: '1.3rem',
                    fontWeight: 900,
                    color: '#1C3002',
                    marginBottom: '0.4rem',
                  }}
                >
                  ยังไม่ได้เลือกสินค้า
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    fontSize: '0.88rem',
                    color: '#5E6C4B',
                    margin: 0,
                  }}
                >
                  กรุณาเลือก E-book จากเมนู Dropdown ด้านซ้าย เพื่อดูสรุปยอดคำสั่งซื้อ
                </p>
              </div>
            )}

            {/* Status notice */}
            <div
              style={{
                backgroundColor: '#E9FFB6',
                border: '1.5px solid #000000',
                borderRadius: '4px',
                padding: '0.75rem 1rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontSize: '0.85rem',
                color: '#1C3002',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} />
              <span>INITIAL STATUS: PENDING (รอการจำลองชำระเงิน)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div
          className="figma-bg-pink-dots"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            fontFamily: 'var(--font-ubuntu-mono), monospace',
            fontSize: '1.2rem',
            color: '#1C3002',
          }}
        >
          กำลังโหลดข้อมูลคำสั่งซื้อ...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
