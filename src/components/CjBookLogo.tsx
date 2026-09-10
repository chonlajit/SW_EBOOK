import React from 'react';

export default function CjBookLogo({ size = 260 }: { size?: number }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: `${size}px`, marginBottom: '1.25rem' }}>
      <svg
        viewBox="0 0 300 240"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="bookDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a0a0c" />
            <stop offset="100%" stopColor="#181a24" />
          </linearGradient>

          <linearGradient id="cyberRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2a2a" />
            <stop offset="100%" stopColor="#b81414" />
          </linearGradient>
        </defs>

        {/* ================= 1. THE FUTURISTIC OPEN BOOK ICON ================= */}
        <g transform="translate(150, 75)">
          {/* Spine glow / accent */}
          <rect x="-6" y="-38" width="12" height="74" rx="3" fill="#ff2a2a" opacity="0.9" />

          {/* Left Wing (Back cover) */}
          <path
            d="M -6,-36 L -94,-18 C -100,-16 -104,-10 -104,-3 L -104,36 C -104,42 -99,47 -93,45 L -6,28 Z"
            fill="url(#bookDark)"
            stroke="#0a0a0c"
            strokeWidth="2.5"
          />

          {/* Left Wing Pages (Cybernetic White Layered Sheets) */}
          <path
            d="M -6,-31 L -88,-15 C -92,-14 -96,-9 -96,-4 L -96,31 C -96,36 -91,40 -86,39 L -6,24 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <path
            d="M -6,-26 L -82,-12 C -86,-11 -89,-6 -89,-2 L -89,27 C -89,31 -85,34 -81,33 L -6,20 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          {/* Right Wing (Back cover) */}
          <path
            d="M 6,-36 L 94,-18 C 100,-16 104,-10 104,-3 L 104,36 C 104,42 99,47 93,45 L 6,28 Z"
            fill="url(#bookDark)"
            stroke="#0a0a0c"
            strokeWidth="2.5"
          />

          {/* Right Wing Pages (Cybernetic White Layered Sheets) */}
          <path
            d="M 6,-31 L 88,-15 C 92,-14 96,-9 96,-4 L 96,31 C 96,36 91,40 86,39 L 6,24 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          <path
            d="M 6,-26 L 82,-12 C 86,-11 89,-6 89,-2 L 89,27 C 89,31 85,34 81,33 L 6,20 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          {/* Book Spine Center Plate */}
          <rect x="-3" y="-36" width="6" height="66" rx="2" fill="#0a0a0c" />
          <circle cx="0" cy="-26" r="2.5" fill="#ff2a2a" />
          <circle cx="0" cy="18" r="2.5" fill="#ff2a2a" />

          {/* Stylized 'C' on Left Book Page */}
          <path
            d="M -22,-8 L -52,-2 C -60,0 -64,5 -64,12 L -64,15 C -64,22 -59,26 -51,25 L -22,20 L -22,10 L -46,14 C -49,14 -51,13 -51,10 L -51,8 C -51,5 -49,4 -46,3 L -22,0 Z"
            fill="#0a0a0c"
          />

          {/* Stylized 'J' on Right Book Page in Cyber Red */}
          <path
            d="M 54,-4 L 54,14 C 54,23 47,27 37,25 L 25,23 C 19,22 16,17 16,12 L 16,6 L 27,8 L 27,11 C 27,14 29,15 33,16 L 38,17 C 42,17 44,16 44,12 L 44,-6 Z"
            fill="url(#cyberRed)"
          />

          {/* Cyber Pin Circuit marks on book corners */}
          <circle cx="-75" cy="5" r="2" fill="#ff2a2a" />
          <line x1="-75" y1="5" x2="-68" y2="5" stroke="#ff2a2a" strokeWidth="1.5" />
          <circle cx="75" cy="5" r="2" fill="#0a0a0c" />
          <line x1="75" y1="5" x2="68" y2="5" stroke="#0a0a0c" strokeWidth="1.5" />
        </g>

        {/* ================= 2. CJ SHOP TYPOGRAPHY ================= */}
        <g transform="translate(150, 190)">
          <text
            x="0"
            y="0"
            fontFamily="var(--font-honfleur), 'Honfleur', sans-serif"
            fontSize="38"
            fontWeight="900"
            fill="#0a0a0c"
            letterSpacing="-1.5"
            textAnchor="middle"
          >
            CJ SHOP
          </text>
          
          {/* Tech Underline with Red Pins */}
          <line x1="-90" y1="12" x2="90" y2="12" stroke="#0a0a0c" strokeWidth="2" />
          <rect x="-90" y="10" width="8" height="4" fill="#ff2a2a" />
          <rect x="82" y="10" width="8" height="4" fill="#ff2a2a" />

          <text
            x="0"
            y="28"
            fontFamily="'Space Grotesk', monospace"
            fontSize="10"
            fontWeight="700"
            fill="#5c6470"
            letterSpacing="3"
            textAnchor="middle"
          >
            DIGITAL E-BOOK STORE
          </text>
        </g>
      </svg>
    </div>
  );
}
