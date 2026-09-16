import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_USERS } from '@/lib/authStore';
import { User, UserRole } from '@/lib/types';

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
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUsernameOrEmail, newRole, requesterRole } = body;

    // Security check: Only an admin can promote
    if (requesterRole !== 'admin') {
      return NextResponse.json(
        { error: 'เฉพาะผู้ที่มีบทบาท ADMIN เท่านั้นที่สามารถเปลี่ยน Role สมาชิกได้' },
        { status: 403 }
      );
    }

    if (!['admin', 'user'].includes(newRole)) {
      return NextResponse.json(
        { error: 'Role ไม่ถูกต้อง (ต้องเป็น "admin" หรือ "user")' },
        { status: 400 }
      );
    }

    const users = loadUsers();
    const query = (targetUsernameOrEmail || '').trim().toLowerCase();

    const userIndex = users.findIndex(
      (u) =>
        u.username.toLowerCase() === query ||
        u.email.toLowerCase() === query
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: `ไม่พบผู้ใช้ "${targetUsernameOrEmail}" ในระบบ` },
        { status: 404 }
      );
    }

    users[userIndex].role = newRole as UserRole;
    saveUsers(users);

    const { password: _, ...safeUser } = users[userIndex];

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: `เปลี่ยน Role ของ ${safeUser.username} เป็น ${newRole.toUpperCase()} เรียบร้อยแล้ว`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
