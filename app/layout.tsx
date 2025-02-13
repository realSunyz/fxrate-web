import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig, META_THEME_COLORS } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/navbar";

const PingFangSC = localFont({
  src: [
    {
      path: "./fonts/PingFangSC-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
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
        </ThemeProvider>
      </body>
    </html>
  );
}
