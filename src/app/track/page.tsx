'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import {
  Search,
  Mail,
  Hash,
  ShieldCheck,
  Loader2,
  Download,
  ExternalLink,
  CreditCard,
  BookOpen,
  User,
  ShoppingBag,
  RotateCcw,
  LogIn
} from 'lucide-react';
import Link from 'next/link';
import { OrderStatus } from '@/lib/types';

interface OrderItem {
  id: string;
  book_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: OrderStatus;
  paid_at?: string;
  created_at: string;
  download_count?: number;
  downloadUrl?: string;
  book?: {
    id: string;
    title: string;
    author: string;
    cover_url: string;
    price: number;
    file_path: string;
  };
}

export default function TrackOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  // Manual search state
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // User orders state
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders for logged-in user and any email used at checkout
  const fetchUserOrders = async (userEmail: string) => {
    setOrdersLoading(true);
    try {
      const emailToSearch = userEmail.trim().toLowerCase();
      const res = await fetch(`/api/orders?email=${encodeURIComponent(emailToSearch)}`);
      const data = await res.json();
      let foundOrders: OrderItem[] = (res.ok && data.orders) ? data.orders : [];

      // Also check if customer ordered with another email (e.g. toon.chitmart@gmail.com)
      const lastCheckoutEmail = typeof window !== 'undefined' ? localStorage.getItem('cjshop_checkout_email') : null;
      if (lastCheckoutEmail && lastCheckoutEmail.toLowerCase() !== emailToSearch) {
        try {
          const res2 = await fetch(`/api/orders?email=${encodeURIComponent(lastCheckoutEmail.trim().toLowerCase())}`);
          const data2 = await res2.json();
          if (res2.ok && data2.orders && data2.orders.length > 0) {
            const existingIds = new Set(foundOrders.map((o) => o.id));
            for (const o of data2.orders) {
              if (!existingIds.has(o.id)) {
                foundOrders.push(o);
                existingIds.add(o.id);
              }
            }
          }
        } catch {}
      }

      setOrders(foundOrders);
    } catch (err) {
      console.warn('Failed to load user purchase history:', err);
    } finally {
      setOrdersLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const lastCheckoutEmail = typeof window !== 'undefined' ? localStorage.getItem('cjshop_checkout_email') : null;
    const targetEmail = user?.email || lastCheckoutEmail || '';
    if (targetEmail) {
      setEmail(targetEmail);
      fetchUserOrders(targetEmail);
    } else {
      setOrders([]);
      setOrdersLoading(false);
    }
  }, [user]);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orderId.trim()) {
      setErrorMsg('กรุณากรอกรหัสคำสั่งซื้อ เช่น ORD-...');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('กรุณากรอกอีเมลที่ใช้สั่งซื้อเพื่อยืนยันสิทธิ์');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.order) {
        throw new Error(data.error || 'ไม่พบคำสั่งซื้อที่ตรงกับรหัสและอีเมลนี้');
      }

      router.push(`/order/${data.order.id}/status`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตรวจสอบ';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <div
      className="figma-bg-pink-dots"
      style={{
        flex: 1,
        padding: '3rem 1rem 5rem 1rem',
        minHeight: '100%',
      }}
    >
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#000000',
              color: '#E9FFB6',
              padding: '3px 12px',
              borderRadius: '3px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '0.6rem',
            }}
          >
            // ORDER TRACKING &amp; PURCHASE HISTORY
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
            TRACK ORDER
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#1C3002',
              fontSize: '1rem',
              fontWeight: 700,
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            {isAuthenticated
              ? 'ยินดีต้อนรับ! ระบบแสดงประวัติการสั่งซื้อและดาวน์โหลด E-book ของบัญชีคุณโดยอัตโนมัติ'
              : 'กรอกรหัสคำสั่งซื้อและอีเมล หรือเข้าสู่ระบบเพื่อดูประวัติการซื้อและรับลิงก์ดาวน์โหลดหนังสือ'}
          </p>
        </div>

        {/* ========================================================
            SECTION 1: LOGGED-IN PURCHASE HISTORY
            ======================================================== */}
        {isAuthenticated ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '8px solid #E9FFB6',
              borderRadius: '4px',
              padding: '2rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              marginBottom: '2.5rem',
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                paddingBottom: '1rem',
                borderBottom: '2.5px solid #000000',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '4px',
                    backgroundColor: '#1C3002',
                    color: '#E9FFB6',
                    border: '1.5px solid #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingBag size={22} />
                </div>
                <div>
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
                    YOUR PURCHASE HISTORY
                  </h2>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B' }}>
                    บัญชีผู้ใช้: <strong style={{ color: '#000000' }}>{user?.name || user?.username}</strong> ({user?.email})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (user?.email) {
                    setRefreshing(true);
                    fetchUserOrders(user.email);
                  }
                }}
                disabled={ordersLoading || refreshing}
                style={{
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  border: '1.5px solid #000000',
                  borderRadius: '4px',
                  padding: '6px 14px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RotateCcw size={14} className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'กำลังโหลด...' : 'รีเฟรชประวัติ'}</span>
              </button>
            </div>

            {/* Orders List / Empty State */}
            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 0.75rem auto', color: '#1C3002' }} />
                <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#1C3002' }}>
                  กำลังดึงข้อมูลประวัติการสั่งซื้อของคุณ...
                </div>
              </div>
            ) : orders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {orders.map((item) => {
                  const book = item.book;
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';

                  return (
                    <div
                      key={item.id}
                      style={{
                        border: '4px solid #E9FFB6',
                        borderRadius: '4px',
                        padding: '1.25rem',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* Book & Order Meta */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '60px',
                            height: '80px',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            backgroundColor: '#D9D9D9',
                            flexShrink: 0,
                            border: '2px solid #000000',
                          }}
                        >
                          <img
                            src={book?.cover_url || '/covers/book1.svg'}
                            alt={book?.title || 'E-book'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/covers/book1.svg';
                            }}
                          />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-ubuntu-mono), monospace',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                color: '#1C3002',
                                backgroundColor: '#E9FFB6',
                                padding: '2px 6px',
                                border: '1px solid #000000',
                                borderRadius: '3px',
                              }}
                            >
                              #{item.id}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B' }}>
                              • {dateStr}
                            </span>
                          </div>

                          <div
                            style={{
                              fontWeight: 900,
                              fontSize: '1.15rem',
                              fontFamily: "var(--font-victory), sans-serif",
                              color: '#000000',
                              marginBottom: '2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {book?.title || 'รายการสั่งซื้อ E-book'}
                          </div>

                          <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#000000' }}>
                            ผู้เขียน: {book?.author || '-'} | ยอดชำระ:{' '}
                            <strong style={{ color: '#1C3002', fontSize: '1rem', fontFamily: "var(--font-victory), sans-serif" }}>
                              ฿{Number(item.amount).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Status & Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          flexWrap: 'wrap',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <OrderStatusBadge status={item.status} />

                        {item.status === 'PAID' ? (
                          <>
                            <a
                              href={item.downloadUrl || `/api/download/${item.id}`}
                              download
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                backgroundColor: '#1C3002',
                                color: '#E9FFB6',
                                border: '1.5px solid #000000',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-ubuntu-mono), monospace',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                              }}
                            >
                              <Download size={14} />
                              <span>ดาวน์โหลดไฟล์</span>
                            </a>

                            <Link
                              href={`/order/${item.id}/status`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                border: '1.5px solid #000000',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-ubuntu-mono), monospace',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                              }}
                            >
                              <ExternalLink size={13} />
                              <span>สถานะ</span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/order/${item.id}/payment`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                backgroundColor: '#1C3002',
                                color: '#E9FFB6',
                                border: '1.5px solid #000000',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-ubuntu-mono), monospace',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                              }}
                            >
                              <CreditCard size={14} />
                              <span>ชำระเงิน</span>
                            </Link>

                            <Link
                              href={`/order/${item.id}/status`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                border: '1.5px solid #000000',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-ubuntu-mono), monospace',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                              }}
                            >
                              <ExternalLink size={13} />
                              <span>ดูข้อมูล</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '4px',
                  border: '2.5px dashed #000000',
                }}
              >
                <BookOpen size={42} color="#1C3002" style={{ margin: '0 auto 0.75rem auto' }} />
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    fontFamily: "var(--font-victory), sans-serif",
                    color: '#000000',
                    marginBottom: '0.35rem',
                  }}
                >
                  ยังไม่มีประวัติการสั่งซื้อหนังสือ
                </div>
                <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B', marginBottom: '1.5rem' }}>
                  คุณยังไม่ได้สั่งซื้อหนังสือ E-book ในระบบ สามารถเลือกดูหนังสือและสั่งซื้อได้ทันที
                </p>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 20px',
                    backgroundColor: '#1C3002',
                    color: '#E9FFB6',
                    border: '2px solid #000000',
                    borderRadius: '4px',
                    fontFamily: "var(--font-victory), sans-serif",
                    fontWeight: 900,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  }}
                >
                  เลือกซื้อหนังสือหน้าร้าน (BROWSE CATALOG)
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* Guest Notice: Prompt to Login */
          <div
            style={{
              backgroundColor: '#1C3002',
              border: '4px solid #E9FFB6',
              borderRadius: '4px',
              padding: '1.5rem 2rem',
              marginBottom: '2.5rem',
              color: '#ffffff',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              boxShadow: '0 10px 28px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '4px',
                  backgroundColor: '#E9FFB6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1C3002',
                  flexShrink: 0,
                  border: '1.5px solid #000000',
                }}
              >
                <User size={24} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-victory), sans-serif", fontSize: '1.25rem', fontWeight: 900, color: '#E9FFB6' }}>
                  ดูประวัติการซื้อทั้งหมดของคุณโดยอัตโนมัติ
                </div>
                <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#D9D9D9', marginTop: '2px' }}>
                  เข้าสู่ระบบเพื่อดูรายการคำสั่งซื้อและดาวน์โหลดไฟล์ E-book ย้อนหลังได้ทันทีโดยไม่ต้องจำรหัสคำสั่งซื้อ
                </div>
              </div>
            </div>

            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                backgroundColor: '#E9FFB6',
                color: '#1C3002',
                border: '2px solid #000000',
                borderRadius: '4px',
                fontFamily: "var(--font-victory), sans-serif",
                fontWeight: 900,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <LogIn size={16} />
              <span>เข้าสู่ระบบ (LOGIN)</span>
            </Link>
          </div>
        )}

        {/* ========================================================
            SECTION 2: MANUAL ORDER SEARCH BY ID & EMAIL
            ======================================================== */}
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
            <div>
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
                SEARCH SPECIFIC ORDER
              </h2>
              <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B', marginTop: '2px' }}>
                ค้นหาคำสั่งซื้อเจาะจงด้วยรหัสคำสั่งซื้อ (ORDER ID) และอีเมล
              </div>
            </div>
            <span
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#1C3002',
                display: 'inline-block',
              }}
            />
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '1rem 1.25rem',
                backgroundColor: '#FFDED9',
                border: '3px solid #000000',
                borderRadius: '6px',
                color: '#000000',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleManualSearch}>
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
                รหัสคำสั่งซื้อ (ORDER ID)
              </label>
              <div style={{ position: 'relative' }}>
                <Hash
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
                  placeholder="เช่น ORD-202609-1001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
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

            <div style={{ marginBottom: '1.5rem' }}>
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
                อีเมลที่ใช้สั่งซื้อ (EMAIL)
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
                  placeholder="เช่น name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <div
              style={{
                marginBottom: '1.75rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#FFDED9',
                border: '1.5px solid #000000',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                color: '#1C3002',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} color="#1C3002" style={{ flexShrink: 0 }} />
              <span>ระบบตรวจสอบความถูกต้องของอีเมลเพื่อป้องกันการเข้าถึงข้อมูลของลูกค้ารายอื่น</span>
            </div>

            <button
              type="submit"
              disabled={loading}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s ease',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>กำลังค้นหาข้อมูล...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>ค้นหาคำสั่งซื้อ (SEARCH)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
