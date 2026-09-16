import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_USERS, isValidEmail, isValidUsername } from '@/lib/authStore';
import { User } from '@/lib/types';

function getUsersFilePath() {
  return path.join(process.cwd(), 'data', 'users.json');
}

function loadUsers(): User[] {
  const filePath = getUsersFilePath();
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to load users from file:', e);
  }
  return DEFAULT_USERS;
}

function saveUsers(users: User[]) {
  const filePath = getUsersFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, email, password } = body;

    // 1. Validation
    if (!username || !isValidUsername(username)) {
      return NextResponse.json(
        { error: 'Username ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลข 3-24 ตัวอักษร (เช่น john_dev)' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อ-นามสกุล หรือ Display Name อย่างน้อย 2 ตัวอักษร' },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'รูปแบบอีเมลไม่ถูกต้อง กรุณาระบุเช่น user@example.com' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    const users = loadUsers();

    // Check duplicate username
    if (users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      return NextResponse.json(
        { error: `Username "${username}" มีผู้ใช้งานแล้ว กรุณาเลือกชื่ออื่น` },
        { status: 409 }
      );
    }

    // Check duplicate email
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return NextResponse.json(
        { error: `อีเมล "${email}" ได้ลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบแทน` },
        { status: 409 }
      );
    }

    // STRICT USER REQUIREMENT: Public registration is ALWAYS role 'user'
    const newUser: User = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      username: username.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'user', // strictly user!
      password: password,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Return safe user without password
    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'สมัครสมาชิกสำเร็จ! บัญชีของคุณได้รับสิทธิ์เป็น ผู้ใช้งานทั่วไป (Role: user)',
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: error?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
}
