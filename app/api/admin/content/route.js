import { NextResponse } from 'next/server';
import { pinContent, unpinContent, hideContent, unhideContent, getPinnedContent, getHiddenContent } from '@/services/adminService';

export async function GET() {
  const [pinned, hidden] = await Promise.all([getPinnedContent(), getHiddenContent()]);
  return NextResponse.json({ pinned, hidden });
}

export async function POST(request) {
  const body = await request.json();
  const { action, movie } = body;

  switch (action) {
    case 'pin':     await pinContent(movie); break;
    case 'unpin':   await unpinContent(movie.id); break;
    case 'hide':    await hideContent(movie); break;
    case 'unhide':  await unhideContent(movie.id); break;
    default: return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
