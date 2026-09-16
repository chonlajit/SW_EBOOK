'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { BooksProvider } from '@/context/BooksContext';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BooksProvider>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </BooksProvider>
    </AuthProvider>
  );
}
