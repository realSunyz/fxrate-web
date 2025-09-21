import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { siteConfig, META_THEME_COLORS } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar";
import { ThemeSync } from "@/components/theme-sync";

const rawCaptchaProvider =
  (process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER ?? "turnstile").toLowerCase();
const captchaProvider =
  rawCaptchaProvider === "recaptcha" ? "recaptcha" : "turnstile";
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const recaptchaScriptSrc = recaptchaSiteKey
  ? `https://www.recaptcha.net/recaptcha/api.js?render=${recaptchaSiteKey}`
  : "https://www.recaptcha.net/recaptcha/api.js";

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
    <html lang="zh-Hans" suppressHydrationWarning>
      <head>
        <Script src="https://cdn.sunyz.net/assets/fxrate/themeScript.js" />
        <Script
          src="https://analytics.sunyz.net/script.js"
          data-website-id="1931c3e7-60cd-4d04-92d1-e16ee61f5588"
        />
        {captchaProvider === "recaptcha" ? (
          <script src={recaptchaScriptSrc} async defer></script>
        ) : (
          <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
          ></script>
        )}
      </head>
      <body className={cn("bg-background antialiased", PingFangSC)}>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme
            disableTransitionOnChange
          >
            <ThemeSync />
            <NavBar />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
