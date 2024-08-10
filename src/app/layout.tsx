import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import { ThemeProvider } from "@/components/theme/provider";

const fontHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.creator.name,
      url: siteConfig.creator.url,
    },
  ],
  creator: siteConfig.creator.name,
  icons: {
    icon: "/favicon.ico",
  },
  // OpenGraph metadata
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 2880,
        height: 1622,
        alt: siteConfig.name,
      },
    ],
    type: "website",
    locale: "en_US",
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    site: siteConfig.creator.url,
    title: siteConfig.title,
    description: siteConfig.description,
    images: {
      url: siteConfig.ogImage,
      width: 2800,
      height: 1622,
      alt: siteConfig.name,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(fontHeading.variable, fontSans.variable)}>
        <main className="flex flex-col flex-grow min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
