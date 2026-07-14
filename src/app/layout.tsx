import type { Metadata } from "next";
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
    default: "Aperio — Free Open-Source API Documentation",
    template: "%s · Aperio",
  },
  description:
    "Aperio is a free, open-source API documentation platform. Drop in any OpenAPI or Swagger file and get beautiful interactive docs with try-it-out, code samples, and zero authentication.",
  keywords: [
    "OpenAPI",
    "Swagger",
    "API documentation",
    "API reference",
    "open source",
    "Aperio",
  ],
  openGraph: {
    title: "Aperio — Free Open-Source API Documentation",
    description:
      "Beautiful interactive API docs from OpenAPI. Free forever. No signup.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.svg", type: "image/svg+xml", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
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
