import { adminDb } from '@/services/firebase-admin';

/**
 * Fetches all content that should be hidden from the platform.
 * Returns a Set of IDs for fast lookup.
 */
export async function getHiddenIds() {
  try {
    if (!adminDb) return new Set();
    const snap = await adminDb.collection('admin_hidden').get();
    return new Set(snap.docs.map(doc => doc.id));
  } catch (e) {
    console.error('Failed to fetch hidden IDs:', e);
    return new Set();
  }
}

/**
 * Fetches all content that has been pinned by admins.
 * Returns an array of movie objects.
 */
export async function getPinnedContent() {
  try {
    if (!adminDb) return [];
    const snap = await adminDb.collection('admin_pins').orderBy('pinnedAt', 'desc').get();
    return snap.docs.map(doc => {
      const data = doc.data();
      // Serialize Firestore Timestamps to ISO strings
      if (data.pinnedAt && data.pinnedAt.toDate) {
        data.pinnedAt = data.pinnedAt.toDate().toISOString();
      }
      return { ...data, id: doc.id, isPinned: true };
    });
  } catch (e) {
    console.error('Failed to fetch pinned content:', e);
    return [];
  }
}

/**
 * Filters an array of TMDB results by removing hidden items.
 */
export function filterHidden(items, hiddenIds) {
  if (!items || !hiddenIds || hiddenIds.size === 0) return items || [];
  return items.filter(item => !hiddenIds.has(item.id.toString()));
}
