import fs from 'fs';
import path from 'path';
import { Book } from './types';
import { INITIAL_BOOKS } from './booksData';

const BOOKS_FILE = path.join(process.cwd(), 'data', 'books.json');

function loadBooksFromFile(): Book[] {
  try {
    if (fs.existsSync(BOOKS_FILE)) {
      const raw = fs.readFileSync(BOOKS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read data/books.json:', err);
  }
  return [...INITIAL_BOOKS];
}

function persistBooksToFile(books: Book[]) {
  try {
    const dir = path.dirname(BOOKS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write data/books.json:', err);
  }
}

// Global in-memory storage for active books across API routes
const globalForBooks = global as unknown as { serverBooks: Book[] };
if (!globalForBooks.serverBooks) {
  globalForBooks.serverBooks = loadBooksFromFile();
  persistBooksToFile(globalForBooks.serverBooks);
}
export const serverBooks = globalForBooks.serverBooks;

export function getAllBooks(): Book[] {
  return serverBooks;
}

export function getBookById(id: string): Book | undefined {
  return serverBooks.find((b) => b.id === id);
}

export function addServerBook(book: Book): Book {
  const index = serverBooks.findIndex((b) => b.id === book.id);
  if (index >= 0) {
    serverBooks[index] = book;
  } else {
    serverBooks.unshift(book); // add to top
  }
  persistBooksToFile(serverBooks);
  return book;
}

export function deleteServerBook(id: string): boolean {
  const index = serverBooks.findIndex((b) => b.id === id);
  if (index >= 0) {
    serverBooks.splice(index, 1);
    persistBooksToFile(serverBooks);
    return true;
  }
  return false;
}

export function updateServerBook(id: string, updatedData: Partial<Book>): Book {
  const index = serverBooks.findIndex((b) => b.id === id);
  if (index >= 0) {
    serverBooks[index] = { ...serverBooks[index], ...updatedData };
    persistBooksToFile(serverBooks);
    return serverBooks[index];
  } else {
    // If not found in serverBooks (e.g. from client localStorage or custom ID), UPSERT it!
    const newBook: Book = {
      id,
      title: updatedData.title || 'Untitled Book',
      author: updatedData.author || 'Dev Guru',
      description: updatedData.description || '',
      price: updatedData.price !== undefined ? Number(updatedData.price) : 199,
      cover_url: updatedData.cover_url || '/covers/book1.svg',
      file_path: updatedData.file_path || 'sample-vibe-coding.pdf',
      tags: updatedData.tags || ['E-BOOK'],
      pages: updatedData.pages || 100,
    };
    serverBooks.unshift(newBook);
    persistBooksToFile(serverBooks);
    return newBook;
  }
}

export function resetServerBooks(): Book[] {
  serverBooks.length = 0;
  serverBooks.push(...INITIAL_BOOKS);
  persistBooksToFile(serverBooks);
  return serverBooks;
}
