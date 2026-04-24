import { NextResponse } from 'next/server';
import { getIntelligenceSummary } from '@/services/analyticsService';
import { admin } from '@/services/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    const summary = await getIntelligenceSummary(range);
    
    if (!summary) {
      return NextResponse.json({ error: 'Failed to aggregate analytics' }, { status: 500 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
