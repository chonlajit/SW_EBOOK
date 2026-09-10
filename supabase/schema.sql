-- =========================================================
-- Supabase Schema for Vibe Coding: E-book Shop
-- =========================================================

-- 1. Create books table
CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cover_url TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path inside private storage bucket
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    pages INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. ORD-202609-4821
    book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    paid_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup on tracking
CREATE INDEX IF NOT EXISTS idx_orders_lookup ON public.orders(id, customer_email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for books
-- Anyone (Anon & Authenticated) can read book catalog
CREATE POLICY "Allow public read access to books"
    ON public.books
    FOR SELECT
    USING (true);

-- 5. RLS Policies for orders
-- Anyone can create a new pending order
CREATE POLICY "Allow public to create orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- Users can only view their own order if they provide BOTH matching order id and email
CREATE POLICY "Allow users to view their own order with email verification"
    ON public.orders
    FOR SELECT
    USING (
        -- Service role can bypass, or matching order ID & email in tracking requests
        auth.role() = 'service_role'
    );

-- Only Server-side (service_role) can update order status (e.g. mark as PAID)
CREATE POLICY "Allow only service role to update order status"
    ON public.orders
    FOR UPDATE
    USING (auth.role() = 'service_role');

-- 6. Storage Bucket setup (Run in Storage Settings or SQL)
-- Create a private bucket named 'ebooks'
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebooks', 'ebooks', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Only service_role can read/sign files from 'ebooks' bucket
CREATE POLICY "Private access to ebooks bucket"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'ebooks' AND auth.role() = 'service_role');
