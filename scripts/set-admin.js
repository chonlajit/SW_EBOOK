#!/usr/bin/env node

/**
 * Script สำหรับเปลี่ยน Role ผู้ใช้งาน (เช่น user -> admin) โดยระบุ Username หรือ Email
 * 
 * วิธีใช้งาน:
 *   node scripts/set-admin.js <username_or_email> [role]
 * 
 * ตัวอย่าง:
 *   node scripts/set-admin.js myusername
 *   node scripts/set-admin.js user@example.com admin
 *   node scripts/set-admin.js myusername user
 */

const fs = require('fs');
const path = require('path');

const targetArg = process.argv[2];
const roleArg = (process.argv[3] || 'admin').toLowerCase();

if (!targetArg) {
  console.log('\n❌ กรุณาระบุ username หรือ email ของผู้ใช้ที่ต้องการเปลี่ยน role');
  console.log('📌 วิธีใช้: node scripts/set-admin.js <username_or_email> [role]');
  console.log('👉 ตัวอย่าง: node scripts/set-admin.js cjuser admin\n');
  process.exit(1);
}

if (!['admin', 'user'].includes(roleArg)) {
  console.log('\n❌ Role ต้องเป็น "admin" หรือ "user" เท่านั้น');
  process.exit(1);
}

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

try {
  if (!fs.existsSync(usersFilePath)) {
    console.error('❌ ไม่พบไฟล์ data/users.json');
    process.exit(1);
  }

  const raw = fs.readFileSync(usersFilePath, 'utf8');
  const users = JSON.parse(raw);

  const query = targetArg.toLowerCase().trim();
  const userIndex = users.findIndex(
    (u) =>
      (u.username && u.username.toLowerCase() === query) ||
      (u.email && u.email.toLowerCase() === query)
  );

  if (userIndex === -1) {
    console.log(`\n❌ ไม่พบผู้ใช้ที่ตรงกับ "${targetArg}" ในระบบ`);
    console.log('📋 รายชื่อผู้ใช้ทั้งหมดในระบบ:');
    users.forEach((u) => {
      console.log(`   - Username: [${u.username}] | Email: [${u.email}] | Role: [${u.role}]`);
    });
    console.log('');
    process.exit(1);
  }

  const user = users[userIndex];
  const oldRole = user.role;
  user.role = roleArg;
  users[userIndex] = user;

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

  console.log('\n========================================');
  console.log('✨ [CJ-SHOP SECURITY SYSTEM] ROLE UPDATED');
  console.log('========================================');
  console.log(`👤 Username : ${user.username}`);
  console.log(`📧 Email    : ${user.email}`);
  console.log(`🏷️  Old Role : ${oldRole.toUpperCase()}`);
  console.log(`🔥 New Role : ${roleArg.toUpperCase()}`);
  console.log('========================================');
  console.log('✅ บันทึกข้อมูลสำเร็จ! เมื่อผู้ใช้รีเฟรชหน้าเว็บหรือล็อกอินใหม่จะได้รับสิทธิ์นี้ทันที\n');
} catch (err) {
  console.error('❌ เกิดข้อผิดพลาดในการรันสคริปต์:', err.message);
  process.exit(1);
}
