'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBooks } from '@/context/BooksContext';
import { LogOut, User as UserIcon, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Props {
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  onOpenAdminModal?: () => void;
}

export default function FigmaTopNav({
  searchTerm: propSearchTerm,
  onSearchChange: propOnSearchChange,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { searchTerm: contextSearchTerm, setSearchTerm: contextSetSearchTerm } = useBooks();
  const { totalItems, setIsCartOpen } = useCart();

  const activeSearch = propSearchTerm !== undefined ? propSearchTerm : contextSearchTerm;
  const handleSearchChange = (val: string) => {
    if (propOnSearchChange) {
      propOnSearchChange(val);
    } else {
      contextSetSearchTerm(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (pathname !== '/') {
        router.push('/#bestseller-section');
      }
    }
  };

  const isHome = pathname === '/';
  const isCheckout = pathname.startsWith('/checkout');
  const isTrack = pathname.startsWith('/track');
  const isLogin = pathname.startsWith('/login');

  return (
    <>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            maxWidth: '1207px',
            width: '100%',
            minHeight: '75px',
            backgroundColor: '#213902',
            border: '5px solid #E9FFB6',
            borderRadius: '24px',
            padding: '0.4rem 2rem',
            flexWrap: 'wrap',
            boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
          }}
        >
          {/* Left: E BOOK Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-gondens), 'Bebas Neue', sans-serif",
                fontSize: '30px',
                lineHeight: 1,
                fontWeight: 400,
                color: '#ffffff',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              E BOOK
            </span>
          </Link>

          {/* Center: Search Bar (Only shown on Home page) */}
          {isHome && (
            <div
              style={{
                flex: '1',
                maxWidth: '460px',
                minWidth: '220px',
                height: '39px',
                backgroundColor: '#FFDED9',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
              }}
            >
              <input
                type="text"
                value={activeSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="search bar"
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#000000',
                  border: 'none',
                  fontSize: '18px',
                  fontFamily: "var(--font-ubuntu-mono), monospace",
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* Right: Navigation Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
              fontFamily: "var(--font-gondens), 'Bebas Neue', sans-serif",
              fontSize: '30px',
              letterSpacing: '0.5px',
              lineHeight: 1,
            }}
          >
            <Link
              href="/"
              style={{
                color: isHome ? '#E9FFB6' : '#ffffff',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              HOME
            </Link>

            <Link
              href="/checkout"
              style={{
                color: isCheckout ? '#E9FFB6' : '#ffffff',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              CHECKOUT
            </Link>

            <Link
              href="/track"
              style={{
                color: isTrack ? '#E9FFB6' : '#ffffff',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              TRACKER
            </Link>

            {/* CART Button with Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              title="เปิดดูตะกร้าสินค้า (Shopping Cart)"
              style={{
                background: totalItems > 0 ? '#E9FFB6' : 'transparent',
                color: totalItems > 0 ? '#1C3002' : '#ffffff',
                border: totalItems > 0 ? '2px solid #000000' : 'none',
                borderRadius: '6px',
                padding: totalItems > 0 ? '4px 10px' : '0',
                cursor: 'pointer',
                fontFamily: "var(--font-gondens), 'Bebas Neue', sans-serif",
                fontSize: '28px',
                letterSpacing: '0.5px',
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                boxShadow: totalItems > 0 ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <span>CART</span>
              {totalItems > 0 && (
                <span
                  style={{
                    backgroundColor: '#1C3002',
                    color: '#E9FFB6',
                    fontSize: '13px',
                    fontFamily: 'var(--font-ubuntu-mono), monospace',
                    fontWeight: 900,
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    minWidth: '18px',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* If user not logged in, show sleek login link */}
            {!user && (
              <Link
                href="/login"
                style={{
                  color: isLogin ? '#E9FFB6' : '#D9D9D9',
                  fontSize: '22px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <UserIcon size={16} />
                <span>LOGIN</span>
              </Link>
            )}

            {/* User Sign Out */}
            {user && (
              <button
                type="button"
                onClick={logout}
                title="ออกจากระบบ (Logout)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E9FFB6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  opacity: 0.85,
                }}
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
