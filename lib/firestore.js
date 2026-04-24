import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { db, auth, app } from './firebase'
import { fetcherWithToken } from './swr-fetcher'
import { 
  doc, setDoc, deleteDoc, getDoc, collection, addDoc, 
  serverTimestamp, onSnapshot, query, orderBy 
} from 'firebase/firestore'

// ==========================================
// UTILITY FUNCTIONS (Writes)
// ==========================================

export async function toggleWatchlist(userId, movie, isWatchlisted) {
  if (!userId || !movie) return;
  const user = auth.currentUser;
  if (!user) return;
  
  const token = await user.getIdToken();
  const res = await fetch('/api/user/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ movie, isWatchlisted })
  });

  if (!res.ok) {
    throw new Error('Failed to toggle watchlist');
  }
}

export async function toggleFavorite(userId, movie, isFavorited) {
  if (!userId || !movie) return;
  const user = auth.currentUser;
  if (!user) return;
  
  const token = await user.getIdToken();
  const res = await fetch('/api/user/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ movie, isFavorited })
  });

  if (!res.ok) {
    throw new Error('Failed to toggle favorite');
  }
}

export async function addToHistory(userId, movie) {
  if (!userId || !movie) return;
  const user = auth.currentUser;
  if (!user) return;
  
  const token = await user.getIdToken();
  const res = await fetch('/api/user/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ movie })
  });

  if (!res.ok) {
    throw new Error('Failed to add to history');
  }
}

export async function postReview(movieId, userId, userName, rating, text) {
  if (!userId || !movieId || !text || rating < 1 || rating > 5) throw new Error("Invalid review data");
  
  const reviewsRef = collection(db, 'movies', movieId.toString(), 'reviews');
  await addDoc(reviewsRef, {
    userId,
    userName: userName || 'Anonymous',
    rating,
    text,
    createdAt: serverTimestamp()
  });
}

// ==========================================
// REAL-TIME HOOKS (Reads)
// ==========================================

export function useWatchlist(userId) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? '/api/user/watchlist' : null,
    fetcherWithToken
  );

  return { 
    watchlist: data?.watchlist || [], 
    loading: isLoading,
    mutate
  };
}

export function useFavorites(userId) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? '/api/user/favorites' : null,
    fetcherWithToken
  );

  return { 
    favorites: data?.favorites || [], 
    loading: isLoading,
    mutate
  };
}

export function useHistory(userId) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? '/api/user/history' : null,
    fetcherWithToken
  );

  return { 
    history: data?.history || [], 
    loading: isLoading,
    mutate
  };
}

export function useReviews(movieId) {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    if (!movieId) return;

    const q = query(collection(db, 'movies', movieId.toString(), 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [movieId]);

  return reviews;
}
