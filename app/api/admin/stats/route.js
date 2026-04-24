import { NextResponse } from 'next/server';
import { getOverviewStats } from '@/services/adminService';
import { auth } from '@/services/firebase-admin';

async function verifyAdmin(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = await auth.verifyIdToken(token);
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!adminEmails.includes(decoded.email)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request) {
  // For SSR admin pages we skip token check (server-side already protected)
  // For direct API calls, verify admin
  const isServerRequest = request.headers.get('x-admin-internal') === 'true';
  if (!isServerRequest) {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getOverviewStats();
  return NextResponse.json(stats, {
    headers: { 'Cache-Control': 'private, no-cache' }
  });
}
