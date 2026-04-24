import { Suspense } from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import PageTransition from '@/components/layout/PageTransition'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { SWRConfig } from 'swr'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: '%s | CineVerse',
    default: 'CineVerse | Premium SaaS Entertainment Platform',
  },
  description: 'Discover, track, and share the latest movies and TV shows in a premium cinematic experience.',
  openGraph: {
    title: 'CineVerse | Premium Entertainment',
    description: 'Discover, track, and share the latest movies and TV shows.',
    url: 'https://cineverse.com',
    siteName: 'CineVerse',
    images: [
      {
        url: 'https://cineverse.com/og-image.jpg', // Placeholder for actual OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineVerse',
    description: 'Your premium SaaS entertainment platform.',
  },
}

import { AppProvider } from '@/context/AppContext'
import MobileAppContainer from '@/components/mobile/MobileAppContainer'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground overflow-x-hidden min-h-screen`}>
        <AppProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              <SWRConfig value={{
                revalidateOnFocus: false,
                revalidateIfStale: false,
                dedupingInterval: 600000,
              }}>
                <MobileAppContainer>
                  <main className="md:ml-64 pt-20 md:pt-0 min-h-screen pb-24 md:pb-0">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                </MobileAppContainer>
              </SWRConfig>
            </div>
          </div>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  )
}
