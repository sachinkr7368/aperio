import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
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
  title: {
    default: "Aperio — Beautiful free API documentation",
    template: "%s · Aperio",
  },
  description:
    "Aperio is a free, open-source API documentation platform. Interactive OpenAPI references, request client, multi-language code samples, models, and environments — no signup required.",
  applicationName: "Aperio",
  keywords: [
    "OpenAPI",
    "Swagger",
    "API documentation",
    "API reference",
    "API client",
    "open source",
    "Aperio",
    "free API docs",
  ],
  authors: [{ name: "Aperio" }],
  openGraph: {
    title: "Aperio — Beautiful free API documentation",
    description:
      "Interactive API docs from OpenAPI. Free forever. No signup. Open source.",
    type: "website",
    siteName: "Aperio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aperio — Beautiful free API documentation",
    description:
      "Interactive API docs from OpenAPI. Free forever. No signup.",
  },
  // Icons are primarily generated from src/app/icon.tsx + apple-icon.tsx
  // (Next.js App Router). Public SVGs match the logo for PWA/fallback.
  icons: {
    icon: [
      { url: "/favicon.svg?v=4", type: "image/svg+xml" },
      { url: "/icon-192.svg?v=4", type: "image/svg+xml", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.svg?v=4", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=4",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
