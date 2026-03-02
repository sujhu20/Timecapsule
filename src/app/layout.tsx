import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { Analytics } from '@/components/analytics'
import { PerformanceMonitor } from '@/components/performance-monitor'
import './globals.css'
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { NotificationProvider } from '@/components/notification-provider'
import { ScrollToTop } from '@/components/scroll-to-top'
import { CookieBanner } from '@/components/cookie-banner'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://timecapsul.com'),
  title: {
    default: 'Timecapsul - Preserve Your Memories',
    template: '%s | Timecapsul'
  },
  description: 'Create and preserve your memories in digital time capsules. Share your stories with future generations.',
  keywords: ['time capsule', 'digital memories', 'memory preservation', 'digital legacy', 'future messages'],
  authors: [{ name: 'Timecapsul Team' }],
  creator: 'Timecapsul',
  publisher: 'Timecapsul',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://timecapsul.com',
    siteName: 'Timecapsul',
    title: 'Timecapsul - Preserve Your Memories',
    description: 'Create and preserve your memories in digital time capsules. Share your stories with future generations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Timecapsul - Digital Time Capsules',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timecapsul - Preserve Your Memories',
    description: 'Create and preserve your memories in digital time capsules. Share your stories with future generations.',
    images: ['/og-image.jpg'],
    creator: '@timecapsul',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationProvider>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-grow pt-2">
                  <Suspense fallback={<div className="flex items-center justify-center h-full min-h-[50vh]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>}>
                    {children}
                  </Suspense>
                </main>
                <Footer />
              </div>
            </NotificationProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <PerformanceMonitor />
        <ScrollToTop />
        <CookieBanner />
      </body>
    </html>
  )
} 