import { NextResponse } from 'next/server';
import { auth } from '@/services/firebase-admin';

export async function GET(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ isAdmin: false });

  try {
    const decoded = await auth.verifyIdToken(token);
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
    const isAdmin = adminEmails.includes(decoded.email);
    return NextResponse.json({ isAdmin, email: decoded.email });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
