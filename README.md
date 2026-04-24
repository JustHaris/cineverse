# CineVerse Intelligence Platform 🦇

CineVerse is a sophisticated cinematic exploration and analytics platform designed to bridge the gap between media discovery and data-driven insights. Built on a modern full-stack architecture, CineVerse offers an immersive, app-like experience for users while providing administrators with robust content management and engagement tracking tools.

---

## 🚀 Live Demo
<<<<<<< HEAD
👉 https://cineverse-seven-five.vercel.app/
=======
Visit the live application: [cineverse-seven-five.vercel.app](https://cineverse-seven-five.vercel.app/)
>>>>>>> ad6c097 (CineVerse v2: added footer + legal pages + docs update)

---

## ✨ Key Features

### 🎬 Cinematic Experience
- **Immersive Viewing**: Intelligent detail pages that automatically hide global navigation to focus on cinematic content.
- **Dynamic UI Lighting**: Real-time extraction of dominant poster colors to generate ambient background lighting effects.
- **Smart Routing**: Unified architecture handling both Movies and TV Shows with context-aware metadata.
- **Interactive Search**: High-performance, debounced search system across the entire TMDB database.

### 📊 Intelligence & Analytics
- **Engagement Tracking**: Granular monitoring of user interactions, including watch activity, favorites, and watchlist additions.
- **Admin Dashboard**: Secure control panel for monitoring platform health, user retention (DAU/WAU), and content performance.
- **Content Control**: Tools for administrators to pin featured content or hide specific entries from the global feed.

### 📱 Premium UX & Performance
- **Mobile-First Design**: Native-style bottom navigation and gesture-based interactions optimized for touch devices.
- **SWR Data Fetching**: Advanced caching and revalidation strategy for near-instant data availability.
- **Optimistic Updates**: Immediate UI feedback for user actions like favoriting or adding to watchlists.
- **Optimized SEO**: Dynamic metadata generation and JSON-LD schema (Movie, Article, Breadcrumbs) for superior search visibility.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Vanilla CSS + Tailwind Utility System
- **Animations**: Framer Motion

### Backend & Infrastructure
- **Server**: Next.js API Routes (Node.js & Edge Runtime)
- **Security**: Firebase Admin SDK (Server-side token verification)
- **Authentication**: Firebase Auth (Google & Email/Password)

### Data Layer
- **Database**: Cloud Firestore (NoSQL)
- **Media API**: The Movie Database (TMDB)
- **News API**: GNews (Integrated Blog System)

---

## 📸 Screenshots

| Homepage | Movie Details |
| :---: | :---: |
| ![Homepage](placeholder-homepage.png) | ![Movie Details](placeholder-details.png) |

| Profile Dashboard | Mobile View |
| :---: | :---: |
| ![Profile](placeholder-profile.png) | ![Mobile](placeholder-mobile.png) |

---


## 📂 Project Structure

```bash
├── app/                  # App Router: Pages & API Endpoints
├── components/           # Modular UI Components (Layout, Movie, Analytics)
├── context/              # React Context Providers (Auth, UI State)
├── hooks/                # Custom React Hooks (useAuth, useIsAdmin)
├── lib/                  # Library Configurations (Firebase, TMDB, Utils)
├── services/             # Server-side Business Logic & SEO Generators
└── public/               # Static Assets & Global Styles
```

---

## 💻 Local Development

### 1. Prerequisites
- Node.js 18 or higher
- A Firebase Project (with Auth and Firestore enabled)
- TMDB API Key

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/JustHaris/cineverse.git
cd cineverse
<<<<<<< HEAD
=======

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and populate it with your credentials:
```env
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_key_here

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... (see DEPLOYMENT_GUIDE.md for full list)

# Firebase Admin (Secret)
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
ADMIN_EMAILS=yourname@example.com
```

---

## 🚀 Deployment
CineVerse is optimized for deployment on **Vercel**. For a detailed step-by-step production guide, refer to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## 👤 Author
**Haris Khan**  
GitHub: [@JustHaris](https://github.com/JustHaris)

---
*CineVerse Intelligence Platform — Professional Cinematic SaaS Architecture.*
>>>>>>> ad6c097 (CineVerse v2: added footer + legal pages + docs update)
