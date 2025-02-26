import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { siteConfig, META_THEME_COLORS } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";

const PingFangSC = localFont({
  src: [
    {
      path: "./assets/PingFangSC-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: siteConfig.keywords,
  icons: siteConfig.icons,
  manifest: `${siteConfig.url}/site.webmanifest`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: `${siteConfig.url}/og.png`,
    creator: "@AS150289",
  },
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://cdn.sunyz.net/assets/fxrate/themeScript.js" />
        <Script
          src="https://analytics.sunyz.net/script.js"
          data-website-id="fbb4e03c-b077-4e93-9023-818b8a84c53b"
        />
      </head>
      <body className={cn("bg-background antialiased", PingFangSC)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <NavBar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
