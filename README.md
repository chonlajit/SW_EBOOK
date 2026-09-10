# Vibe Coding: E-book Shop (3 Platforms: Web, Mobile .APK, Desktop .EXE)

ระบบร้านค้า E-book ตัวอย่าง พัฒนาตามแนวคิด **Vibe Coding** เพื่อตอบโจทย์ใบงานครบถ้วนทั้ง 3 แพลตฟอร์ม:
1. **Web View**: เว็บไซต์ Responsive (Next.js 15 App Router, TypeScript, Vanilla CSS) สำหรับ Deploy บน Vercel
2. **Mobile View (.APK)**: แอปพลิเคชันมือถือ Android สร้างด้วย MIT App Inventor (WebViewer)
3. **Desktop View (.EXE)**: โปรแกรมเดสก์ท็อป Windows สร้างด้วย Electron Wrapper

---

## 🌟 ฟีเจอร์เด่นตามใบงาน (Features Checklist)

- [x] **หน้าร้าน (Storefront):** แสดง E-book 3 เล่ม (Mastering Vibe Coding, Next.js & Supabase, Web to Mobile Guide) พร้อมรูปปก ชื่อ คำอธิบาย และราคา
- [x] **รายละเอียด & สั่งซื้อ (Checkout):** เลือกหนังสือ กรอกชื่อ-อีเมล และมีหน้าสรุปรายการก่อนยืนยัน
- [x] **สร้างคำสั่งซื้อ (Order PENDING):** สร้างรหัสคำสั่งซื้อ เช่น `ORD-202609-XXXX` และบันทึกสถานะเริ่มต้นเป็น `PENDING`
- [x] **Mock Payment:** มีป้าย **DEMO ONLY** ชัดเจน แสดง QR จำลอง และมีปุ่ม **"จำลองชำระเงินสำเร็จ"**
- [x] **อัปเดตสถานะ (PAID) & ส่งมอบ:** เปลี่ยนสถานะเป็น `PAID` อัตโนมัติ พร้อมออก Signed URL ดาวน์โหลดชั่วคราว และจำลอง/ส่งอีเมลยืนยัน
- [x] **ติดตามผล (Order Tracking):** ค้นหาและดูสถานะคำสั่งซื้อด้วย Order ID และ Email โดยไม่เปิดเผยข้อมูลผู้อื่น
- [x] **ความปลอดภัย (Security):** รองรับ Row Level Security (RLS) บน Supabase, เก็บ Secret ไว้บน Server-side เท่านั้น

---

## 🚀 วิธีการรันในเครื่อง (Local Development)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันเซิร์ฟเวอร์ Next.js (Web View)
```bash
npm run dev
```
เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

---

## 💻 วิธีการรัน Desktop App (.EXE)

โปรเจกต์นี้มี Electron Wrapper สำหรับรันเป็นโปรแกรม Desktop บน Windows:

### 1. ทดสอบรัน Desktop Window
```bash
npm run electron:dev
```

### 2. บิลด์เป็นไฟล์ `.exe` สำหรับส่งงาน
```bash
npm run electron:build
```
ไฟล์ `.exe` จะถูกสร้างในโฟลเดอร์ `dist/` สามารถดับเบิลคลิกเปิดใช้งานบน Windows ได้ทันที

---

## 📱 วิธีการทำ Mobile App (.APK)

ดูขั้นตอนแบบละเอียดพร้อมภาพผังบล็อกได้ที่ไฟล์ [mobile/README.md](file:///d:/SW_finalrproject/mobile/README.md):
1. เปิด [MIT App Inventor](https://appinventor.mit.edu/)
2. วางคอมโพเนนต์ `WebViewer1` บน `Screen1`
3. ตั้งค่า `HomeUrl` เป็น **Vercel Production URL** และตั้ง `IgnoreSslErrors = false`
4. ใส่บล็อกควบคุมปุ่มย้อนกลับ (BackPressed: `WebViewer1.GoBack`)
5. กดเมนู **Build** → **Android App (.apk)** เพื่อรับไฟล์ `.apk`

---

## ☁️ การเชื่อมต่อ Supabase & Deploy บน Vercel

1. **Supabase Setup:**
   - นำโค้ดในไฟล์ [supabase/schema.sql](file:///d:/SW_finalrproject/supabase/schema.sql) และ [supabase/seed.sql](file:///d:/SW_finalrproject/supabase/seed.sql) ไปรันใน Supabase SQL Editor
   - สร้าง Storage Bucket ชื่อ `ebooks` (ตั้งเป็น Private) แล้วอัปโหลดไฟล์ PDF
2. **Environment Variables:**
   ตั้งค่าใน Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (สำหรับบริการส่งอีเมลจริง)
   - `NEXT_PUBLIC_APP_URL`
3. **Deploy บน Vercel:**
   - Push โค้ดขึ้น GitHub (ระบบมี `.gitignore` ป้องกันไม่ให้ `.env.local` หลุด)
   - นำเข้า Repo ไปยัง Vercel และกด Deploy จะได้รับ Production URL ทันที
