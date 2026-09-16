import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_USERS } from '@/lib/authStore';

function getUsersFromFile() {
  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  try {
    if (fs.existsSync(usersPath)) {
      const content = fs.readFileSync(usersPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading data/users.json:', e);
  }
  return DEFAULT_USERS;
}

export async function GET() {
  const users = getUsersFromFile();
  // Strip passwords for safety
  const safeUsers = users.map(({ password, ...rest }: any) => rest);
  return NextResponse.json({ users: safeUsers });
}
