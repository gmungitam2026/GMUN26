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

/**
 * A page refresh always starts from the top. Browsers normally restore the
 * previous scroll position on reload (which also restores scroll-driven state
 * like the home page's logo fill); this turns that off for reloads only, so
 * back/forward navigation still returns you to where you were. Runs inline in
 * <head>, before the browser gets a chance to restore.
 */
const scrollResetOnReloadScript = `(function(){try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){history.scrollRestoration="manual";if(location.hash){history.replaceState(null,"",location.pathname+location.search)}window.scrollTo(0,0);addEventListener("load",function(){window.scrollTo(0,0);history.scrollRestoration="auto"})}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollResetOnReloadScript }} />
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
