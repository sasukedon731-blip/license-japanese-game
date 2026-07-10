
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}
// app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"

const APP_NAME = "外免切替 Japanese Learning App"

export const metadata: Metadata = {
  title: APP_NAME,
  applicationName: APP_NAME,
  description: "外国免許切替向けの日本語・知識学習アプリ",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: APP_NAME,
    description: "外国免許切替向けの日本語・知識学習アプリ",
    siteName: APP_NAME,
    type: "website",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: APP_NAME }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
