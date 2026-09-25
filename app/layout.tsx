import type { Metadata } from "next";
import { fraunces, inter } from "./fonts";
import { site } from "@/config/site";
import { NavBar } from "@/components/navigation/NavBar";
import { Footer } from "@/components/sections/Footer";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { TransitionOrigin } from "@/components/providers/TransitionOrigin";
import { themeInitScript } from "@/components/navigation/ThemeToggle";
import { Starfield } from "@/components/ui/Starfield";
import { SiteIntro } from "@/components/ui/SiteIntro";
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
 * A page refresh always starts from the top. Browsers restore the previous
 * scroll position on reload (and on phones they may do it late, once tall
 * content has loaded). So restoration is switched off as the page is being
 * left (pagehide), which is what a reload does first; the reloaded page then
 * snaps to the top as it loads. Restoration is re-enabled shortly after load
 * so Back/Forward between pages inside the site still returns you to where
 * you were. Runs inline in <head>, before anything paints.
 */
const scrollResetOnReloadScript = `(function(){try{var h=history;addEventListener("pagehide",function(){h.scrollRestoration="manual"});var n=performance.getEntriesByType("navigation")[0];if(!n||n.type!=="reload"){h.scrollRestoration="auto";return}h.scrollRestoration="manual";if(location.hash){h.replaceState(h.state,"",location.pathname+location.search)}var top=function(){window.scrollTo(0,0)};top();document.addEventListener("DOMContentLoaded",top);addEventListener("load",function(){top();requestAnimationFrame(top);setTimeout(function(){top();h.scrollRestoration="auto"},1000)})}catch(e){}})();`;

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
        <SiteIntro />
        <Starfield />
        <TransitionOrigin />
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
