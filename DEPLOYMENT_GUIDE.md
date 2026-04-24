# CineVerse - Vercel Deployment & Firebase Production Guide

Follow these exact steps to push your local CineVerse code to the internet using Vercel.

---

## Part 1: GitHub Setup
1. Go to your local terminal inside the CineVerse folder.
2. Initialize and commit your code:
   ```bash
   git add .
   git commit -m "Initial commit - CineVerse ready for production"
   ```
3. Go to [GitHub.com](https://github.com), create a new repository named `cineverse`.
4. Copy the "Push an existing repository from the command line" code and run it in your terminal:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cineverse.git
   git push -u origin main
   ```

---

## Part 2: Firebase Admin SDK Setup (CRITICAL)
For the Admin Panel to work in production, you must generate a Private Key.

1. Go to the [Firebase Console](https://console.firebase.google.com).
2. Click the **Settings (Gear icon)** -> **Project Settings**.
3. Go to the **Service accounts** tab.
4. Click **Generate new private key**. A `.json` file will download.
5. Open this `.json` file. You will need the `client_email` and `private_key` values for the next step.

---

## Part 3: Vercel Deployment
1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New Project**.
3. Import your `cineverse` repository.
4. **Environment Variables**: Open your local `.env.local` file. You must copy every variable into the Vercel dashboard:

   **Public Variables (Client-side):**
   - `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API Key.
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

   **Secret Variables (Server-side):**
   - `FIREBASE_CLIENT_EMAIL`: Found in the `.json` file from Part 2.
   - `FIREBASE_PRIVATE_KEY`: Found in the `.json` file from Part 2. (Copy the whole string, including `-----BEGIN PRIVATE KEY-----`).
   - `ADMIN_EMAILS`: A comma-separated list of emails allowed to access the admin panel (e.g., `yourname@gmail.com,admin@cineverse.com`).

5. Click **Deploy**. Vercel will build your code and provide a live URL.

---

## Part 4: Firebase Production Configuration
Now that your app is live, you must tell Firebase to trust your Vercel URL.

### 1. Authentication Authorized Domains
1. In Firebase Console, go to **Authentication** -> **Settings** -> **Authorized domains**.
2. Click **Add domain** and paste your Vercel URL (e.g., `cineverse-xyz.vercel.app`). Do NOT include `https://`.

### 2. Firestore Security Rules
1. Go to **Firestore Database** -> **Rules**.
2. Ensure your rules allow for user-specific data and public reviews, while protecting the admin collections:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User-specific data
    match /users/{userId}/{collectionName}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Movie Reviews
    match /movies/{movieId}/reviews/{reviewId} {
      allow read: if true;
      allow create, update: if request.auth != null 
                            && request.resource.data.rating >= 1 
                            && request.resource.data.rating <= 5;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Admin Control collections (Server-side only via Admin SDK)
    match /admin_pins/{document=**} {
      allow read: if true;
      allow write: if false; // Only Admin SDK can write
    }
    match /admin_hidden/{document=**} {
      allow read: if true;
      allow write: if false; // Only Admin SDK can write
    }
  }
}
```
3. Click **Publish**.

---

Congratulations! CineVerse is now live, secure, and ready for your users.
