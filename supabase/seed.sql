-- =========================================================
-- Seed Data: E-book Shop Catalog (Minimum 3 items)
-- =========================================================

INSERT INTO public.books (id, title, author, description, price, cover_url, file_path, tags, pages)
VALUES
(
    'book-vibe-coding',
    'Mastering Vibe Coding with AI',
    'Dev Guru & DeepMind Pair',
    'คู่มือฉบับสมบูรณ์สำหรับการเขียนโค้ดร่วมกับ AI อย่างมีทิศทาง ตั้งแต่การเขียน Prompt สถาปัตยกรรมระบบ จนถึงการ Deploy จริงบน Cloud',
    199.00,
    '/covers/book1.svg',
    'sample-vibe-coding.pdf',
    ARRAY['AI', 'Coding', 'Productivity'],
    220
),
(
    'book-nextjs-supabase',
    'Next.js 15 & Supabase Fullstack Blueprint',
    'Alex Rivera',
    'เรียนรู้การสร้างเว็บแอปพลิเคชันระดับ Production ด้วย Next.js App Router, Supabase PostgreSQL, Authentication, และ Private Storage',
    249.00,
    '/covers/book2.svg',
    'sample-nextjs-supabase.pdf',
    ARRAY['Next.js', 'Supabase', 'Fullstack'],
    310
),
(
    'book-web-to-mobile',
    'From Web to Mobile App: Complete Wrapper Guide',
    'Sarah Chen',
    'แนวทางการแปลง Web Application เป็น Mobile App และ Desktop App อย่างรวดเร็วด้วย MIT App Inventor, WebViewer และ Electron',
    179.00,
    '/covers/book3.svg',
    'sample-web-to-mobile.pdf',
    ARRAY['Mobile', 'MIT App Inventor', 'Android'],
    185
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    cover_url = EXCLUDED.cover_url,
    file_path = EXCLUDED.file_path,
    tags = EXCLUDED.tags,
    pages = EXCLUDED.pages;
