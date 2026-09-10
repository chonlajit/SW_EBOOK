'use client';

import React, { useState } from 'react';
import { INITIAL_BOOKS } from '@/lib/booksData';
import BookCard from '@/components/BookCard';
import CjBookLogo from '@/components/CjBookLogo';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  BookOpen,
  Smartphone,
  Monitor,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = INITIAL_BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem 0 4rem 0' }}>
      {/* ========================================================
          TRUE MASONRY GRID (ตามผัง MASONRY LAYOUT ความเยื้องไม่เท่ากัน)
          grid-template-areas:
            "topbar   topbar   menu"
            "cjshop   center1  menu"
            "cjshop   center2  center2";
          ======================================================== */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 340px) 1fr minmax(220px, 250px)',
              gridTemplateRows: 'auto 1fr auto',
              gridTemplateAreas: `
                "topbar   topbar   menu"
                "cjshop   center1  menu"
                "cjshop   center2  center2"
              `,
              gap: '1.25rem',
              alignItems: 'stretch',
            }}
            className="hero-masonry-grid"
          >
            {/* 1. TOPBAR: Spans Columns 1 & 2 (E-BOOK + Search Bar + [Q]) */}
            <div
              className="tech-box"
              style={{
                gridArea: 'topbar',
                padding: '0.85rem 1.5rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}
            >
              {/* E-BOOK Title (Honfleur Heavy) */}
              <div
                style={{
                  fontFamily: "var(--font-honfleur), 'Honfleur', sans-serif",
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  color: '#0a0a0c',
                  letterSpacing: '-1px',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>E-BOOK</span>
                <span className="red-pin"></span>
              </div>

              {/* Center Pill Search Input with Black Square [Q] Button like Wireframe */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '540px',
                  width: '100%',
                  background: '#f8fafc',
                  border: '1.5px solid rgba(10, 10, 12, 0.2)',
                  borderRadius: '9999px',
                  padding: '3px 4px 3px 16px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <input
                  type="text"
                  placeholder="ค้นหาชื่อหนังสือ E-book หรือผู้แต่ง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-tech)',
                    color: '#0a0a0c',
                  }}
                />
                <button
                  type="button"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    background: '#0a0a0c',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="ค้นหา"
                >
                  <Search size={17} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* 2. RIGHT MENU BOX: Sits in Column 3, Rows 1 & 2 (Stops before Row 3) */}
            <div
              className="tech-box"
              style={{
                gridArea: 'menu',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* MENU header (Super Retro M54) with underline exactly like Figma */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      fontFamily: "var(--font-super-retro), 'Super Retro M54', monospace",
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#0a0a0c',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}
                  >
                    MENU
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '2.5px',
                      backgroundColor: '#0a0a0c',
                      marginTop: '4px',
                    }}
                  ></div>
                </div>

                {/* Quick Menu Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <Link
                    href="/"
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 42, 42, 0.08)',
                      color: 'var(--accent-red)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(255, 42, 42, 0.2)',
                    }}
                  >
                    <span>หน้าร้าน (STORE)</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href="/checkout"
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      color: '#0a0a0c',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-tech)',
                    }}
                  >
                    <span>สั่งซื้อ (CHECKOUT)</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href="/track"
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      color: '#0a0a0c',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-tech)',
                    }}
                  >
                    <span>ติดตามผล (TRACK)</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Status footer inside menu */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.65rem 0.75rem',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid var(--border-tech)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ fontWeight: 800, color: '#0a0a0c', marginBottom: '2px' }}>
                  // 3 PLATFORMS
                </div>
                <div>Web • APK • EXE Active</div>
              </div>
            </div>

            {/* 3. LEFT BOX: Column 1, Rows 2 & 3 (TALL BOX: CJ SHOP LOGO + คำอธิบายแพลตฟอร์ม) */}
            <div
              className="tech-box"
              style={{
                gridArea: 'cjshop',
                padding: '1.75rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Book Logo with CJ (Honfleur Heavy) */}
                <CjBookLogo size={260} />

                {/* Subtitle / Platform Tag */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-red)',
                    fontWeight: 700,
                    marginBottom: '0.6rem',
                  }}
                >
                  <span className="red-pin"></span>
                  <span>// PLATFORM SPECIFICATION</span>
                </div>

                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0a0a0c',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-tech)',
                  }}
                >
                  คำอธิบายแพลตฟอร์ม
                </h2>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  ระบบร้านค้า E-book ตัวอย่าง พัฒนาตามข้อกำหนดใบงาน Vibe Coding เชื่อมต่อระบบสั่งซื้อ จำลองชำระเงิน (Mock Payment) พร้อมออก Signed URL ดาวน์โหลดชั่วคราวอย่างปลอดภัย รองรับการใช้งานพร้อมกัน 3 แพลตฟอร์ม (Web View, Mobile .APK, Desktop .EXE)
                </p>
              </div>

              {/* Status footer inside left box */}
              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px dashed var(--border-tech)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  color: 'var(--text-subtle)',
                }}
              >
                <span>SYS.VER 2.026</span>
                <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>PAID DEMO READY</span>
              </div>
            </div>

            {/* 4. CENTER UPPER BOX: Column 2, Row 2 (Featured Cyber Showcase) */}
            <div
              className="tech-box"
              style={{
                gridArea: 'center1',
                padding: '1.75rem 2rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '260px',
              }}
            >
              {/* Top metadata */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-subtle)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="red-pin"></span>
                  <strong style={{ color: '#0a0a0c' }}>CJ-LABS</strong> // BACKING TOMORROW
                </span>
                <span>[ SEC.ID: 4821-VIBE ]</span>
              </div>

              {/* Cyber Stencil Title & Red Reactor Core */}
              <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-cyber)',
                    fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                    fontWeight: 900,
                    letterSpacing: '3px',
                    color: '#0a0a0c',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  CJ LABS
                </div>

                {/* Glowing Red Reactor Core */}
                <div
                  style={{
                    margin: '0.85rem auto 0 auto',
                    width: '90px',
                    height: '90px',
                    borderRadius: '14px',
                    background: '#0a0a0c',
                    border: '2px solid rgba(10, 10, 12, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    position: 'relative',
                  }}
                >
                  <div
                    className="reactor-pulse"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: 'radial-gradient(circle, #ff3b3b 0%, #cc0000 70%, #660000 100%)',
                      boxShadow: '0 0 20px rgba(255, 42, 42, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BookOpen size={20} color="#ffffff" />
                  </div>
                  <span style={{ position: 'absolute', top: '3px', left: '3px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                  <span style={{ position: 'absolute', top: '3px', right: '3px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                  <span style={{ position: 'absolute', bottom: '3px', left: '3px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                  <span style={{ position: 'absolute', bottom: '3px', right: '3px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                </div>
              </div>

              {/* Subtext and Action */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderTop: '1px dashed var(--border-tech)',
                  paddingTop: '0.75rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    maxWidth: '340px',
                    lineHeight: 1.4,
                  }}
                >
                  คลังหนังสือสำหรับนักพัฒนา • สั่งซื้อและรับลิงก์ดาวน์โหลด E-book ทันที
                </p>

                <a
                  href="#recommend-section"
                  className="btn-cyber-red"
                  style={{ padding: '0.6rem 1.3rem', fontSize: '0.85rem' }}
                >
                  <span>EXPLORE BOOKS</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* 5. CENTER LOWER BOX: Spans Columns 2 & 3 in Row 3 (WIDE BOX UNDER CENTER1 & MENU!) */}
            <div
              className="tech-box"
              style={{
                gridArea: 'center2',
                padding: '1.25rem 2rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: '#0a0a0c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}>
                  <Globe size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0a0a0c' }}>WEB VIEW</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vercel Production</div>
                </div>
              </div>

              <div style={{ width: '1px', height: '28px', background: 'var(--border-tech)' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'var(--accent-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}>
                  <Smartphone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0a0a0c' }}>MOBILE APP</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-red)', fontWeight: 700 }}>.APK Installer</div>
                </div>
              </div>

              <div style={{ width: '1px', height: '28px', background: 'var(--border-tech)' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: '#0a0a0c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}>
                  <Monitor size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0a0a0c' }}>DESKTOP APP</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>.EXE Windows</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          RECOMMEND SECTION (Giant Bold Title + 3 Columns of "สินค้า")
          ======================================================== */}
      <section id="recommend-section" style={{ padding: '2.5rem 0 1.5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-red)',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            <span>// FEATURED CATALOG</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-honfleur), 'Honfleur', sans-serif",
              fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#0a0a0c',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '0.75rem',
            }}
          >
            RECOMMEND
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            หนังสือ E-book ตัวอย่างที่แนะนำสำหรับการเรียนรู้การเชื่อมต่อระบบและ Vibe Coding
          </p>
        </div>
      </section>

      {/* 3 COLUMNS OF "สินค้า" */}
      <section style={{ padding: '1rem 0 4rem 0' }}>
        <div className="container">
          {filteredBooks.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index + 1} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1.5px dashed var(--border-tech)',
              }}
            >
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                ไม่พบหนังสือที่ค้นหา &ldquo;{searchTerm}&rdquo;
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="btn-cyber-outline"
              >
                ล้างคำค้นหา
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ECOSYSTEM & PARTNERS BAR */}
      <section
        style={{
          padding: '2.5rem 0',
          borderTop: '1.5px solid var(--border-tech)',
          background: '#ffffff',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              opacity: 0.85,
            }}
          >
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
              CORE ECOSYSTEM:
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2.5rem', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
              <span>▲ NEXT.JS 15</span>
              <span>⚡ SUPABASE</span>
              <span>▲ VERCEL</span>
              <span style={{ color: 'var(--accent-red)' }}>📱 MIT APP INVENTOR</span>
              <span>💻 ELECTRON</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
