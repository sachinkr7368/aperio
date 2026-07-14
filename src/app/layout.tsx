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

const siteUrl = "https://aperio-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Aperio — Free Open Source OpenAPI Docs (API Reference Alternative)",
    template: "%s · Aperio",
  },
  description:
    "Free open-source OpenAPI documentation engine. Interactive API reference, try-it-out, code samples, linter, mock server, and spec diff. No signup. Self-host or embed. MIT licensed alternative for API docs.",
  applicationName: "Aperio",
  keywords: [
    "OpenAPI documentation",
    "free API docs",
    "open source API documentation",
    "OpenAPI reference",
    "Swagger UI alternative",
    "free API documentation tool",
    "OpenAPI linter",
    "API mock from OpenAPI",
    "interactive API docs",
    "self-host API docs",
    "Aperio",
  ],
  authors: [{ name: "Aperio", url: "https://github.com/sachinkr7368/aperio" }],
  creator: "Aperio",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aperio — Free Open Source OpenAPI Documentation",
    description:
      "Interactive API docs from OpenAPI. Lint, mock, diff, embed. Free forever. No signup.",
    type: "website",
    url: siteUrl,
    siteName: "Aperio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aperio — Free Open Source OpenAPI Docs",
    description:
      "Interactive API reference, lint, mock & diff. Free. No signup. MIT.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Aperio",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free open-source OpenAPI documentation engine with interactive API reference, linter, mock, and diff.",
    url: siteUrl,
    license: "https://opensource.org/licenses/MIT",
    codeRepository: "https://github.com/sachinkr7368/aperio",
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
