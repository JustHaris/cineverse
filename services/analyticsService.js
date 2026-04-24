import { adminDb } from './firebase-admin.js';

/**
 * Aggregates analytics events into high-level intelligence metrics.
 */
export async function getIntelligenceSummary(range = '30d') {
  try {
    const now = new Date();
    let startTime;
    
    switch (range) {
      case '24h': startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
      case '7d':  startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case '90d': startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
      case 'all': startTime = new Date(0); break; // Epoch
      default:    startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30d default
    }

    if (!adminDb) {
      console.warn('Analytics Service: adminDb not initialized');
      return null;
    }

    const eventsSnap = await adminDb.collection('analytics_events')
      .where('timestamp', '>', startTime)
      .get();

    const events = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 1. Retention Calculation (DAU/WAU)
    const dailyActive = new Set();
    const weeklyActive = new Set();
    const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

    events.forEach(ev => {
      const ts = ev.timestamp?.toMillis?.() || 0;
      if (ts > oneDayAgo) dailyActive.add(ev.uid);
      if (ts > sevenDaysAgo) weeklyActive.add(ev.uid);
    });

    // 2. Engagement Score & Heatmap Data
    // Score = clicks + favorites(from other table) + views
    const contentMetrics = {}; // key: movieId or slug

    events.forEach(ev => {
      if (ev.type === 'page_view' && (ev.pathname.startsWith('/movie/') || ev.pathname.startsWith('/tv/'))) {
        const id = ev.pathname.split('/')[2];
        if (!contentMetrics[id]) contentMetrics[id] = { views: 0, clicks: 0, score: 0 };
        contentMetrics[id].views++;
        contentMetrics[id].score += 1;
      }
      if (ev.type === 'click' && ev.id) {
        if (!contentMetrics[ev.id]) contentMetrics[ev.id] = { views: 0, clicks: 0, score: 0 };
        contentMetrics[ev.id].clicks++;
        contentMetrics[ev.id].score += 2;
      }
    });

    // 3. Drop-off Funnel
    // Steps: Home -> Detail -> Watchlist/History
    const funnel = { home: 0, detail: 0, action: 0 };
    events.forEach(ev => {
      if (ev.type === 'page_view') {
        if (ev.pathname === '/') funnel.home++;
        if (ev.pathname.startsWith('/movie/') || ev.pathname.startsWith('/tv/')) funnel.detail++;
      }
      if (ev.type === 'click' && (ev.target?.includes('Watchlist') || ev.target?.includes('Favorite'))) {
        funnel.action++;
      }
    });

    return {
      activeUsers: {
        dau: dailyActive.size,
        wau: weeklyActive.size,
      },
      contentMetrics: Object.entries(contentMetrics)
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 10)
        .map(([id, data]) => ({ id, ...data })),
      funnel: [
        { name: 'Home', value: funnel.home },
        { name: 'Detail', value: funnel.detail },
        { name: 'Action', value: funnel.action },
      ]
    };
  } catch (error) {
    console.error('Analytics Aggregation Error:', error);
    return null;
  }
}
