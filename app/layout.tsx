import type { Metadata } from "next";
import { fraunces, inter } from "./fonts";
import { site } from "@/config/site";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/sections/Footer";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { themeInitScript } from "@/components/navigation/ThemeToggle";
import { Starfield } from "@/components/ui/Starfield";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.fullName,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.fullName,
    description: site.description,
    url: site.url,
    siteName: site.fullName,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.fullName,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-ink text-ivory antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-gold-fill focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Starfield />
        <MotionProvider>
          <NavBar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
