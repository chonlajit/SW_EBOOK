'use client';

import React from 'react';

export default function FigmaFooter() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--figma-pink)',
        borderTop: '2px solid #000000',
        padding: '3rem 2rem 2.5rem 2rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left Column: CJ SHOP + E|BOOK + CREATED AT 2026 (font: Milker) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: '3.75rem',
              fontWeight: 900,
              color: '#000000',
              lineHeight: 1.1,
            }}
          >
            CJ SHOP
          </div>

          <div
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: '3.6rem',
              fontWeight: 900,
              color: 'var(--figma-lime)',
              lineHeight: 1,
              marginBottom: '1.25rem',
              WebkitTextStroke: '1px #1C3002',
            }}
          >
            E|BOOK
          </div>

          <div
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '0.5px',
            }}
          >
            CREATED AT 2026
          </div>
        </div>

        {/* Center Column: 3 Platform Breakdown (font: Milker) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '0.5px',
              marginBottom: '0.15rem',
            }}
          >
            3 Platform
          </div>

          <div
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--figma-lime)',
              WebkitTextStroke: '1px #1C3002',
              letterSpacing: '0.5px',
            }}
          >
            WEBSITE PALTFORM
          </div>

          <div
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '0.5px',
            }}
          >
            Desktop Application
          </div>

          <div
            style={{
              fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '0.5px',
            }}
          >
            MOBILE APPLICATION
          </div>
        </div>

        {/* Right Column: Giant DEMO text (font: Gondens_DEMO) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-gondens), 'Honfleur', 'Bebas Neue', sans-serif",
              fontSize: 'clamp(5rem, 8vw, 9rem)',
              fontWeight: 900,
              color: 'var(--figma-green-dark)',
              lineHeight: 0.82,
              letterSpacing: '4px',
              userSelect: 'none',
            }}
          >
            DEMO
          </span>
        </div>
      </div>
    </footer>
  );
}
