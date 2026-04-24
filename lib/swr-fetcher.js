import { getAuth } from 'firebase/auth';
import { app } from './firebase';

export const fetcherWithToken = async (url) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  
  if (!user) throw new Error('Not authenticated');
  
  const token = await user.getIdToken();
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  
  return res.json();
};
