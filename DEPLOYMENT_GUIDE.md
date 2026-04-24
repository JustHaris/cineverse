# CineVerse Deployment & Production Guide 🚀

This guide provides a comprehensive, step-by-step technical walkthrough for deploying the CineVerse Intelligence Platform to a production environment using Vercel and Firebase.

---

## 1. Repository Configuration
Ensure your local environment is synchronized and committed before proceeding.
1. Initialize and commit your code:
   ```bash
   git add .
   git commit -m "chore: prepare for production deployment"
   ```
2. Create a new repository on [GitHub](https://github.com/JustHaris/cineverse) and push your branch:
   ```bash
   git remote add origin https://github.com/JustHaris/cineverse.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Infrastructure Setup (Firebase)
CineVerse utilizes both the Firebase Client SDK and the Admin SDK for secure operations.

### Generate Admin SDK Credentials
1. Navigate to the [Firebase Console](https://console.firebase.google.com).
2. Go to **Project Settings** > **Service Accounts**.
3. Select **Node.js** and click **Generate new private key**.
4. Securely store the downloaded JSON file; you will need the `client_email` and `private_key` values for Vercel.

### Configure Security Rules
Navigate to **Firestore Database** > **Rules** and deploy the following configuration:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{collectionName}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /movies/{movieId}/reviews/{reviewId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.resource.data.rating >= 1;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /{path=**}/reviews/{reviewId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /admin_pins/{document=**} { allow read: if true; allow write: if false; }
  }
}
```

---

## 3. Vercel Deployment
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Populate the following **Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_TMDB_API_KEY` | API Key from The Movie Database. |
| `FIREBASE_CLIENT_EMAIL` | From the Service Account JSON. |
| `FIREBASE_PRIVATE_KEY` | From the Service Account JSON. |
| `ADMIN_EMAILS` | Comma-separated list (e.g., `admin@cineverse.com`). |
| `NEXT_PUBLIC_FIREBASE_*` | All standard Firebase client configuration keys. |

---

## 4. Common Troubleshooting
### 🛑 Authentication Errors (Invalid API Key)
- Ensure the production URL is added to **Firebase Authentication** > **Settings** > **Authorized Domains**.
- Verify that `NEXT_PUBLIC_FIREBASE_API_KEY` matches the key in your Firebase project settings.

### 🛑 Build Failures
- Build failures are frequently caused by missing Environment Variables. Ensure all keys from `.env.local` are replicated in the Vercel dashboard.
- If errors persist, verify that the `FIREBASE_PRIVATE_KEY` includes the full string (including headers/footers).

### 🛑 Profile Review Errors
- If the "My Reviews" section fails to load, ensure you have created the **Collection Group Index** in Firestore for the `reviews` collection (Fields: `userId` ASC, `createdAt` DESC).

---

## 5. Maintenance & Updates
To deploy updates, simply push your changes to the `main` branch. Vercel will automatically trigger a production build.
```bash
git push origin main
```

---
*Built and maintained by [Haris Khan](https://github.com/JustHaris).*
