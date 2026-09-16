'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '@/lib/types';
import { INITIAL_BOOKS } from '@/lib/booksData';

interface BooksContextType {
  books: Book[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addBook: (book: Omit<Book, 'id'> & { id?: string }) => Promise<{ success: boolean; error?: string }>;
  updateBook: (id: string, updatedData: Partial<Book>) => Promise<{ success: boolean; error?: string }>;
  deleteBook: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetBooks: () => Promise<void>;
  getBook: (id: string) => Book | undefined;
  refreshBooks: () => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

const BOOKS_STORAGE_KEY = 'cjshop_custom_books_v2';

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshBooks = async () => {
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        if (data.books && Array.isArray(data.books)) {
          setBooks(data.books);
          localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(data.books));
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch /api/books, using localStorage/default fallback');
    }

    // Fallback to localStorage
    try {
      const raw = localStorage.getItem(BOOKS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBooks(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setBooks(INITIAL_BOOKS);
  };

  useEffect(() => {
    const init = async () => {
      // Immediate load from localStorage for zero flash of content
      try {
        const raw = localStorage.getItem(BOOKS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBooks(parsed);
          }
        }
      } catch {}

      await refreshBooks();
      setLoading(false);
    };
    init();
  }, []);

  const addBook = async (bookData: Omit<Book, 'id'> & { id?: string }) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'ไม่สามารถเพิ่มหนังสือได้' };
      }

      if (data.books) {
        setBooks(data.books);
        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(data.books));
      } else if (data.book) {
        const updated = [data.book, ...books];
        setBooks(updated);
        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(updated));
      }
      return { success: true };
    } catch (err: any) {
      // Local fallback
      const newBook: Book = {
        id: bookData.id || `book-${Date.now()}`,
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        price: Number(bookData.price) || 0,
        cover_url: bookData.cover_url || '/covers/book1.svg',
        file_path: bookData.file_path || 'sample-vibe-coding.pdf',
        tags: bookData.tags || ['E-BOOK'],
        pages: bookData.pages || 100,
      };
      const updated = [newBook, ...books];
      setBooks(updated);
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const res = await fetch(`/api/books?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'ไม่สามารถลบหนังสือได้' };
      }
      if (data.books) {
        setBooks(data.books);
        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(data.books));
      } else {
        const filtered = books.filter((b) => b.id !== id);
        setBooks(filtered);
        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(filtered));
      }
      return { success: true };
    } catch (err: any) {
      const filtered = books.filter((b) => b.id !== id);
      setBooks(filtered);
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(filtered));
      return { success: true };
    }
  };

  const updateBook = async (id: string, updatedData: Partial<Book>) => {
    // Optimistic update
    const updated = books.map((b) => (b.id === id ? { ...b, ...updatedData } : b));
    setBooks(updated);
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(updated));

    try {
      const res = await fetch('/api/books', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If PATCH returned an error, try to upsert with POST
        const fullBook = updated.find((b) => b.id === id);
        if (fullBook) {
          const postRes = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullBook),
          });
          const postData = await postRes.json();
          if (postRes.ok && postData.books) {
            setBooks(postData.books);
            localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(postData.books));
            return { success: true };
          }
        }
        return { success: false, error: data.error || 'ไม่สามารถแก้ไขข้อมูลหนังสือได้' };
      }

      if (data.books) {
        setBooks(data.books);
        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(data.books));
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Network issue on updateBook, kept local update:', err);
      return { success: true };
    }
  };

  const resetBooks = async () => {
    try {
      await fetch('/api/books', { method: 'PUT' });
    } catch {}
    setBooks(INITIAL_BOOKS);
    localStorage.removeItem(BOOKS_STORAGE_KEY);
  };

  const getBook = (id: string) => {
    return books.find((b) => b.id === id);
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        searchTerm,
        setSearchTerm,
        addBook,
        updateBook,
        deleteBook,
        resetBooks,
        getBook,
        refreshBooks,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}
