import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recyce.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Recyce - Sell Electronics for Instant Cash | Electronic Recycling Made Easy",
    template: "%s | Recyce"
  },
  description: "Sell your old phones, tablets, laptops, and electronics for instant cash. Get a quote in 60 seconds. Free shipping, fast payment, and eco-friendly recycling.",
  keywords: [
    "sell phone",
    "sell electronics",
    "electronic recycling",
    "trade-in phone",
    "recycle laptop",
    "sell tablet",
    "eco-friendly recycling",
    "instant cash for electronics",
    "device buyback",
    "phone trade-in"
  ],
  authors: [{ name: "Recyce" }],
  creator: "Recyce",
  publisher: "Recyce",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Recyce',
    title: 'Recyce - Sell Electronics for Instant Cash',
    description: 'Turn your old electronics into cash. Get instant quotes, free shipping, and fast payment. Join thousands making money while helping the environment.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Recyce - Electronic Recycling Made Easy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recyce - Sell Electronics for Instant Cash',
    description: 'Turn your old electronics into cash. Get instant quotes, free shipping, and fast payment.',
    images: ['/og-image.png'],
    creator: '@recyce',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1ab35d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
