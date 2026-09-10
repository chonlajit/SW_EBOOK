# คู่มือการสร้าง Mobile App (.APK) ด้วย MIT App Inventor

คู่มือนี้จัดทำขึ้นตามข้อกำหนดในใบงาน **หน้า 5-6** เพื่อสร้าง Android Wrapper (.APK) สำหรับเปิดเว็บไซต์ E-book Store

---

## 1. ขั้นตอนการตั้งค่าใน MIT App Inventor

1. เข้าเว็บไซต์ [https://appinventor.mit.edu/](https://appinventor.mit.edu/) แล้วคลิก **"Create Apps!"**
2. คลิก **Projects** → **Start new project** → ตั้งชื่อโปรเจกต์ เช่น `VibeEbookShop`
3. ที่พาเนลซ้ายมือ (User Interface) ให้ลากคอมโพเนนต์ **WebViewer** มาวางลงบนหน้าจอ `Screen1`

---

## 2. การตั้งค่า Properties (ตามข้อกำหนดในใบงาน)

### ตั้งค่า `Screen1`:
* **AppName**: `Vibe E-Book`
* **Title**: `Vibe E-Book Store` (หรือชื่อร้าน)
* **Sizing**: เลือกเป็น `Responsive`
* **ShowStatusBar**: `True` (ติ๊กถูก)

### ตั้งค่า `WebViewer1`:
* **Width**: `Fill parent` (เต็มความกว้างจอ)
* **Height**: `Fill parent` (เต็มความสูงจอ)
* **HomeUrl**: ใส่ **Vercel Production URL** เช่น `https://your-project.vercel.app` *(ห้ามใส่ localhost เพราะมือถือเข้าไม่ถึง)*
* **FollowLinks**: `True` (ติ๊กถูก)
* **IgnoreSslErrors**: `False` ⚠️ *(ห้ามติ๊กถูก เพื่อความปลอดภัยตามที่ใบงานสั่งห้ามเด็ดขาด)*
* **UsesLocation**: `False` (หากไม่ได้ใช้ GPS)

---

## 3. การต่อบล็อกคำสั่ง (Blocks Editor)

ตามโจทย์หน้า 5 ข้อ "ปุ่มย้อนกลับ: เมื่อกดย้อนกลับ ถ้า WebViewer1.CanGoBack ให้ WebViewer1.GoBack มิฉะนั้นจึงออกจากแอป":

### แผนผังบล็อกคำสั่ง:
```blocks
when Screen1.BackPressed do
    if call WebViewer1.CanGoBack then
        call WebViewer1.GoBack
    else
        close application
```

1. ไปที่แท็บ **Blocks** (มุมขวาบน)
2. คลิกที่ `Screen1` ทางซ้าย ลากบล็อก `when Screen1.BackPressed do` มาวาง
3. คลิกที่หมวด `Control` ลากบล็อก `if ... then ... else` มาใส่ข้างใน
4. คลิกที่ `WebViewer1` ลากบล็อกฟังก์ชัน:
   - เงื่อนไข `if`: ใส่ `call WebViewer1.CanGoBack`
   - ในช่อง `then`: ใส่ `call WebViewer1.GoBack`
   - ในช่อง `else`: คลิกหมวด `Control` ลากบล็อก `close application` มาใส่

---

## 4. การทดสอบและการส่งออกไฟล์ (Build .APK)

1. **ทดสอบกับมือถือจริง (AI Companion)**:
   - ไปที่เมนู **Connect** → เลือก **AI Companion**
   - ใช้แอป **MIT AI2 Companion** บนมือถือ Android สแกน QR Code เพื่อทดสอบการเปิดหน้าเว็บและกดสั่งซื้อ
2. **Build เป็นไฟล์ติดตั้ง .APK**:
   - ไปที่เมนู **Build** ด้านบน
   - เลือก **Android App (.apk)**
   - รอระบบประมวลผลจนได้ QR Code ดาวน์โหลดไฟล์ `.apk` ลงเครื่องคอมพิวเตอร์และมือถือ
3. **สำรองไฟล์โปรเจกต์ .AIA**:
   - ไปที่เมนู **Projects** → เลือก **Export selected project (.aia) to my computer**
   - เก็บไฟล์ `.aia` ไว้ส่งงานร่วมกับไฟล์ `.apk` ตาม Checklist
