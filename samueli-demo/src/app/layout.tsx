import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartDrawer, Toast } from "@/components/Overlays";
import { publicSiteUrl } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: publicSiteUrl ? new URL(publicSiteUrl) : undefined,
  title: { default: "Veshje për meshkuj | SAMUELI FASHION", template: "%s | SAMUELI FASHION" },
  description: "Xhaketa, kostume sportive, bluza, atlete dhe aksesorë për meshkuj nga SAMUELI FASHION.",
  // Private concept demo — keep it out of search engines.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "SAMUELI FASHION",
    description: "Veshje për meshkuj: xhaketa, kostume sportive, bluza, atlete dhe aksesorë.",
    locale: "sq_AL",
    type: "website",
  },
  twitter: { card: "summary", title: "Veshje për meshkuj | SAMUELI FASHION", description: "Xhaketa, kostume sportive, bluza, atlete dhe aksesorë për meshkuj." },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  viewportFit: "cover",
};

// Runs before paint: CSS hides intro pieces only when JS + motion are available.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('reduce-motion')}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <Providers>
          <a
            href="#main"
            className="sr-only z-[200] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Kalo te përmbajtja
          </a>
          <Header />
          {/* Spacer for the fixed header — constant height so compacting never shifts content */}
          <div aria-hidden className="h-[calc(var(--strip-h)+var(--nav-h))]" />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
