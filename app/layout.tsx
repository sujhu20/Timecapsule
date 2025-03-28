import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { EncryptionProvider } from "@/lib/encryptionContext";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TimeCapsule - Share Your Legacy with the Future",
  description: "A digital platform to create and store personal messages, videos, photos, or documents to be delivered to specific people at a future date.",
  manifest: "/manifest.json",
  themeColor: "#7c3aed",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TimeCapsule",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: '256x256' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/apple-icon-180x180.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 
        The suppressHydrationWarning is used here because browser extensions 
        like Command Palette may add attributes (like cz-shortcut-listen) to the body
      */}
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <EncryptionProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </AuthProvider>
          </EncryptionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
