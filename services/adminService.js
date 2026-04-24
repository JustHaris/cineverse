import { adminDb, adminAuth } from './firebase-admin.js';

// ─────────────────────────────────────────────
// OVERVIEW STATS
// ─────────────────────────────────────────────

export async function getOverviewStats() {
  try {
    // Get total user count from Firebase Auth
    let totalUsers = 0;
    try {
      const listResult = await adminAuth.listUsers(1000);
      totalUsers = listResult.users.length;
    } catch (e) {
      console.warn('Auth listUsers failed:', e.message);
    }

    // Aggregate Firestore data across all users
    const usersSnap = await adminDb.collection('users').get();

    let totalWatchlist = 0;
    let totalHistory = 0;
    let totalFavorites = 0;
    const activeUserIds = new Set();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const dailyActive = new Set();
    const weeklyActive = new Set();
    const contentFrequency = {};

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;

      // Watchlist count
      const watchlistSnap = await adminDb.collection('users').doc(uid).collection('watchlist').get();
      totalWatchlist += watchlistSnap.size;

      // History count + active user tracking
      const historySnap = await adminDb.collection('users').doc(uid).collection('history').get();
      totalHistory += historySnap.size;
      historySnap.docs.forEach(doc => {
        const ts = doc.data().watchedAt?.toMillis?.() || 0;
        if (ts > sevenDaysAgo) { weeklyActive.add(uid); activeUserIds.add(uid); }
        if (ts > oneDayAgo) dailyActive.add(uid);

        // Track content frequency for analytics
        const movieId = doc.data().movieId;
        const title = doc.data().title || 'Unknown';
        if (movieId) {
          const key = `${movieId}||${title}`;
          contentFrequency[key] = (contentFrequency[key] || 0) + 1;
        }
      });

      // Favorites count
      const favSnap = await adminDb.collection('users').doc(uid).collection('favorites').get();
      totalFavorites += favSnap.size;

      // Track favorited content
      favSnap.docs.forEach(doc => {
        const movieId = doc.data().movieId;
        const title = doc.data().title || 'Unknown';
        if (movieId) {
          const key = `fav||${movieId}||${title}`;
          contentFrequency[key] = (contentFrequency[key] || 0) + 1;
        }
      });
    }

    // Build most-watched list
    const mostWatched = Object.entries(contentFrequency)
      .filter(([key]) => !key.startsWith('fav||'))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, count]) => {
        const [movieId, title] = key.split('||');
        return { movieId, title, count };
      });

    const mostFavorited = Object.entries(contentFrequency)
      .filter(([key]) => key.startsWith('fav||'))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, count]) => {
        const [, movieId, title] = key.split('||');
        return { movieId, title, count };
      });

    return {
      totalUsers: totalUsers || usersSnap.size,
      dailyActiveUsers: dailyActive.size,
      weeklyActiveUsers: weeklyActive.size,
      totalWatchlist,
      totalHistory,
      totalFavorites,
      mostWatched,
      mostFavorited,
    };
  } catch (error) {
    console.error('adminService.getOverviewStats error:', error);
    return {
      totalUsers: 0, dailyActiveUsers: 0, weeklyActiveUsers: 0,
      totalWatchlist: 0, totalHistory: 0, totalFavorites: 0,
      mostWatched: [], mostFavorited: [],
    };
  }
}

// ─────────────────────────────────────────────
// RECENT USER ACTIVITY (live feed)
// ─────────────────────────────────────────────

export async function getRecentActivity(limit = 50) {
  try {
    const usersSnap = await adminDb.collection('users').get();
    const activities = [];

    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;

      // History events
      const histSnap = await adminDb
        .collection('users').doc(uid)
        .collection('history')
        .orderBy('watchedAt', 'desc')
        .limit(5)
        .get();
      histSnap.docs.forEach(doc => {
        const d = doc.data();
        activities.push({
          uid: uid.slice(0, 8) + '...',
          action: 'watched',
          title: d.title || 'Unknown',
          poster: d.poster_path || '',
          ts: d.watchedAt?.toMillis?.() || 0,
        });
      });

      // Favorite events
      const favSnap = await adminDb
        .collection('users').doc(uid)
        .collection('favorites')
        .orderBy('addedAt', 'desc')
        .limit(3)
        .get();
      favSnap.docs.forEach(doc => {
        const d = doc.data();
        activities.push({
          uid: uid.slice(0, 8) + '...',
          action: 'favorited',
          title: d.title || 'Unknown',
          poster: d.poster_path || '',
          ts: d.addedAt?.toMillis?.() || 0,
        });
      });

      // Watchlist events
      const wlSnap = await adminDb
        .collection('users').doc(uid)
        .collection('watchlist')
        .orderBy('addedAt', 'desc')
        .limit(3)
        .get();
      wlSnap.docs.forEach(doc => {
        const d = doc.data();
        activities.push({
          uid: uid.slice(0, 8) + '...',
          action: 'watchlisted',
          title: d.title || 'Unknown',
          poster: d.poster_path || '',
          ts: d.addedAt?.toMillis?.() || 0,
        });
      });
    }

    // Sort by timestamp desc
    return activities.sort((a, b) => b.ts - a.ts).slice(0, limit);
  } catch (error) {
    console.error('adminService.getRecentActivity error:', error);
    return [];
  }
}

// ─────────────────────────────────────────────
// PINNED / HIDDEN CONTENT CONTROL
// ─────────────────────────────────────────────

export async function getPinnedContent() {
  try {
    const snap = await adminDb.collection('admin_pins').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function pinContent(movie) {
  await adminDb.collection('admin_pins').doc(movie.id.toString()).set({
    ...movie,
    pinnedAt: new Date(),
  });
}

export async function unpinContent(id) {
  await adminDb.collection('admin_pins').doc(id.toString()).delete();
}

export async function getHiddenContent() {
  try {
    const snap = await adminDb.collection('admin_hidden').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

export async function hideContent(movie) {
  await adminDb.collection('admin_hidden').doc(movie.id.toString()).set({
    ...movie,
    hiddenAt: new Date(),
  });
}

export async function unhideContent(id) {
  await adminDb.collection('admin_hidden').doc(id.toString()).delete();
}
