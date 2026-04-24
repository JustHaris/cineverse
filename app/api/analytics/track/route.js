import { NextResponse } from 'next/server';
import { db } from '@/services/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request) {
  try {
    // Read the text first to handle empty bodies gracefully
    const text = await request.text();
    if (!text) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { type, pathname, uid, timestamp, ...data } = body;

    if (!db) {
      return NextResponse.json({ success: true, mocked: true });
    }

    // Basic bot/crawler filter (optional)
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.includes('bot') || userAgent.includes('spider')) {
      return NextResponse.json({ success: true, filtered: true });
    }

    // Add to raw events collection
    await db.collection('analytics_events').add({
      type,
      pathname,
      uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      clientTimestamp: timestamp,
      ...data
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking Error:', error);
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}
