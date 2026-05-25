import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trio",
  description: "Tu plataforma de streaming favorita",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Trio",
    statusBarStyle: "default",
    startupImage: "/image.png",
  },
  openGraph: {
    title: "Trio – Tu plataforma de streaming",
    description: "Descubre y disfruta tus películas favoritas en Trio.",
    siteName: "Trio",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trio – Tu plataforma de streaming",
    description: "Descubre y disfruta tus películas favoritas en Trio.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/image.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#cc0000" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
