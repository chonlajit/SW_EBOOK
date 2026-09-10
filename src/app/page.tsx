'use client';

import React, { useState } from 'react';
import { INITIAL_BOOKS } from '@/lib/booksData';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  BookOpen,
  Smartphone,
  Monitor,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu
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
    <div style={{ paddingBottom: '4rem' }}>
      {/* ========================================================
          1. TOP BAR (as shown in Image 1: E-BOOK | SEARCH | MENU)
          ======================================================== */}
      <section style={{ padding: '1.5rem 0 1rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1.5px solid var(--border-tech)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          }}>
            {/* Left: E-BOOK */}
            <div style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '1.8rem',
              fontWeight: 900,
              color: '#0a0a0c',
              letterSpacing: '-1px',
            }}>
              E-BOOK
            </div>

            {/* Middle: Search bar with magnifying glass icon */}
            <div style={{ position: 'relative', maxWidth: '600px', width: '100%', justifySelf: 'center' }}>
              <input
                type="text"
                placeholder="ค้นหาชื่อหนังสือ E-book หรือผู้แต่ง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 2.5rem 0.65rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(10, 10, 12, 0.2)',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-tech)',
                  outline: 'none',
                }}
              />
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0a0a0c',
                }}
              />
            </div>

            {/* Right: MENU button */}
            <div style={{
              background: '#f1f5f9',
              border: '1.5px solid #0a0a0c',
              borderRadius: '6px',
              padding: '0.4rem 1.2rem',
              fontFamily: 'var(--font-cyber)',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#0a0a0c',
              textAlign: 'center',
            }}>
              MENU
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. HERO GRID (Matching Image 1: Left Box | Center Boxes | Right Menu Box)
          ======================================================== */}
      <section style={{ padding: '1rem 0 2.5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 320px) 1fr minmax(200px, 240px)',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}>
            {/* 2.1 LEFT BOX: CJ SHOP LOGO + คำอธิบายแพลตฟอร์ม */}
            <div className="tech-box" style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
            }}>
              <div>
                {/* CJ SHOP LOGO WITH TILTED "LOGO" BADGE like Image 1 */}
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-cyber)',
                    fontSize: '3.4rem',
                    fontWeight: 900,
                    lineHeight: 0.85,
                    color: '#0a0a0c',
                    letterSpacing: '-2px',
                  }}>
                    CJ
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-cyber)',
                    fontSize: '2.6rem',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    color: '#0a0a0c',
                    letterSpacing: '-1.5px',
                  }}>
                    SHOP
                  </div>

                  {/* Tilted LOGO tag like Image 1 */}
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '-45px',
                    transform: 'rotate(25deg)',
                    background: '#0a0a0c',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontFamily: 'var(--font-cyber)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    letterSpacing: '1px',
                  }}>
                    LOGO
                  </div>
                </div>

                {/* Subtitle / Platform Tag */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-red)',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}>
                  <span className="red-pin"></span>
                  <span>// PLATFORM SPECIFICATION</span>
                </div>

                <h2 style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#0a0a0c',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-tech)',
                }}>
                  คำอธิบายแพลตฟอร์ม
                </h2>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}>
                  ระบบร้านค้า E-book ตัวอย่าง พัฒนาตามข้อกำหนดใบงาน Vibe Coding เชื่อมต่อระบบสั่งซื้อ จำลองชำระเงิน (Mock Payment) พร้อมออก Signed URL ดาวน์โหลดชั่วคราวอย่างปลอดภัย รองรับการใช้งานพร้อมกัน 3 รูปแบบ
                </p>
              </div>

              {/* Status footer inside left box */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px dashed var(--border-tech)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--text-subtle)',
              }}>
                <span>SYS.VER 2.026</span>
                <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>PAID DEMO READY</span>
              </div>
            </div>

            {/* 2.2 CENTER AREA: Two stacked boxes (Top: Mech Showcase, Bottom: Platform Bar) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* TOP CENTER BOX: Futuristic Mech / Cyber Centerpiece like Image 2 */}
              <div className="tech-box" style={{
                flex: 1,
                padding: '2rem',
                backgroundColor: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                {/* Coordinate markings like Image 2 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-subtle)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="red-pin"></span>
                    <strong style={{ color: '#0a0a0c' }}>CJ-LABS</strong> // BACKING TOMORROW
                  </span>
                  <span>[ SEC.ID: 4821-VIBE ]</span>
                </div>

                {/* Big Cyber Stencil Background Text like Image 2 */}
                <div style={{
                  position: 'relative',
                  margin: '1.5rem 0',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-cyber)',
                    fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                    fontWeight: 900,
                    letterSpacing: '4px',
                    color: '#0a0a0c',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    userSelect: 'none',
                  }}>
                    CJ LABS
                  </div>

                  {/* High-Tech Glowing Center Mech Reactor Core (Red Core like Image 2 with user's Red accent) */}
                  <div style={{
                    margin: '1.25rem auto 0 auto',
                    width: '110px',
                    height: '110px',
                    borderRadius: '16px',
                    background: '#0a0a0c',
                    border: '2px solid rgba(10, 10, 12, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    position: 'relative',
                  }}>
                    {/* Pulsing red reactor core */}
                    <div className="reactor-pulse" style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '10px',
                      background: 'radial-gradient(circle, #ff3b3b 0%, #cc0000 70%, #660000 100%)',
                      boxShadow: '0 0 25px rgba(255, 42, 42, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <BookOpen size={24} color="#ffffff" />
                    </div>

                    {/* Corner clips */}
                    <span style={{ position: 'absolute', top: '4px', left: '4px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                    <span style={{ position: 'absolute', top: '4px', right: '4px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                    <span style={{ position: 'absolute', bottom: '4px', left: '4px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                    <span style={{ position: 'absolute', bottom: '4px', right: '4px', width: '4px', height: '4px', background: 'var(--accent-red)' }}></span>
                  </div>
                </div>

                {/* Subtext and Action Button (Red Pill like 'APPLY NOW' in Image 2) */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderTop: '1px dashed var(--border-tech)',
                  paddingTop: '1rem',
                }}>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    maxWidth: '380px',
                    lineHeight: 1.4,
                  }}>
                    เรียนรู้การเขียนโค้ดร่วมกับ AI • สั่งซื้อและรับลิงก์ E-book ทันทีผ่านระบบจำลอง
                  </p>

                  <a
                    href="#recommend-section"
                    className="btn-cyber-red"
                    style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}
                  >
                    <span>EXPLORE BOOKS</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>

              {/* BOTTOM CENTER BOX: Ecosystem Specs Bar */}
              <div className="tech-box" style={{
                padding: '1.2rem 1.75rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Globe size={18} color="#0a0a0c" />
                  <span>WEB VIEW (VERCEL)</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-tech)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Smartphone size={18} color="var(--accent-red)" />
                  <span>MOBILE APP (.APK)</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-tech)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Monitor size={18} color="#0a0a0c" />
                  <span>DESKTOP APP (.EXE)</span>
                </div>
              </div>
            </div>

            {/* 2.3 RIGHT BOX: Vertical "MENU" Container like Image 1 */}
            <div className="tech-box" style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  paddingBottom: '0.75rem',
                  borderBottom: '2px solid #0a0a0c',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-cyber)',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    color: '#0a0a0c',
                  }}>
                    MENU
                  </span>
                  <span className="red-pin"></span>
                </div>

                {/* Vertical menu links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <Link href="/" style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 42, 42, 0.08)',
                    color: 'var(--accent-red)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span>หน้าร้าน (STORE)</span>
                    <span>→</span>
                  </Link>

                  <Link href="/checkout" style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    color: '#0a0a0c',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span>สั่งซื้อ (CHECKOUT)</span>
                    <span>→</span>
                  </Link>

                  <Link href="/track" style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    color: '#0a0a0c',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span>ติดตามผล (TRACK)</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Sub Menu Info */}
                <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 700, color: '#0a0a0c', marginBottom: '4px' }}>
                    // 3 APPS STATUS
                  </div>
                  <div>• Vercel Web: Ready</div>
                  <div>• MIT .APK: Ready</div>
                  <div>• Electron .EXE: Ready</div>
                </div>
              </div>

              <div style={{
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid var(--border-tech)',
                fontSize: '0.72rem',
                color: 'var(--text-subtle)',
                textAlign: 'center',
              }}>
                CJ-SHOP E-BOOK STORE v1.0
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECTION TITLE: RECOMMEND (Giant bold title like Image 1)
          ======================================================== */}
      <section id="recommend-section" style={{ padding: '3.5rem 0 1.5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-red)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            <span>// FEATURED CATALOG</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-cyber)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            color: '#0a0a0c',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '0.75rem',
          }}>
            RECOMMEND
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            หนังสือ E-book ตัวอย่างที่แนะนำสำหรับการเรียนรู้การเชื่อมต่อระบบและ Vibe Coding
          </p>
        </div>
      </section>

      {/* ========================================================
          4. 3 COLUMNS OF "สินค้า" (Matching Image 1 cards layout)
          ======================================================== */}
      <section style={{ padding: '1rem 0 4rem 0' }}>
        <div className="container">
          {filteredBooks.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}>
              {filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index + 1} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1.5px dashed var(--border-tech)',
            }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                ไม่พบหนังสือที่ค้นหา
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

      {/* ========================================================
          5. PARTNERS & ECOSYSTEM BAR (Matching bottom of Image 2)
          ======================================================== */}
      <section style={{
        padding: '2.5rem 0',
        borderTop: '1.5px solid var(--border-tech)',
        background: '#ffffff',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            opacity: 0.85,
          }}>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
              CORE ECOSYSTEM:
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2.5rem', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ▲ NEXT.JS 15
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚡ SUPABASE
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ▲ VERCEL
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-red)' }}>
                📱 MIT APP INVENTOR
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                💻 ELECTRON
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
