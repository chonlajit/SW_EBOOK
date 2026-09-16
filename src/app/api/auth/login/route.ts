import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_USERS } from '@/lib/authStore';
import { User } from '@/lib/types';

function getUsers(): User[] {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed reading users.json:', e);
  }
  return DEFAULT_USERS;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // identifier can be username or email

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอก Username/Email และ Password' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const query = identifier.trim().toLowerCase();

    const matchedUser = users.find(
      (u) =>
        u.username.toLowerCase() === query ||
        u.email.toLowerCase() === query
    );

    if (!matchedUser) {
      return NextResponse.json(
        { error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' },
        { status: 401 }
      );
    }

    if (matchedUser.password !== password) {
      return NextResponse.json(
        { error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' },
        { status: 401 }
      );
    }

    const { password: _, ...safeUser } = matchedUser;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: `ยินดีต้อนรับ ${safeUser.name} (${safeUser.role.toUpperCase()})`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}
