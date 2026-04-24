import { NextResponse } from 'next/server';
import { getRecentActivity } from '@/services/adminService';

export async function GET() {
  const activity = await getRecentActivity(60);
  return NextResponse.json({ activity }, {
    headers: { 'Cache-Control': 'private, no-cache' }
  });
}
