import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NoInspect from "@/components/NoInspect";
import { profile } from "@/data/resume";

// Typography: Apple devices render Apple's own system font, SF Pro (its licence doesn't allow
// serving it as a web font). Everyone else gets Inter, the closest open-source match, self-hosted
// by next/font. See --font-system in globals.css.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// Marks Apple platforms before the first paint so --font-system can pick SF Pro there. Needed
// because Chrome on a Mac only reaches SF Pro through system-ui, which on Android/Windows is
// Roboto/Segoe UI; Safari and iOS are also covered without JS by @supports in globals.css.
const APPLE_PLATFORM_SCRIPT = `try{var p=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||"";if(/mac|iphone|ipad|ipod/i.test(p)||/iPhone|iPad|iPod/.test(navigator.userAgent))document.documentElement.classList.add("apple")}catch(e){}`;


export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: profile.metaDescription,
};

// viewport-fit=cover lets the mobile dock and prototype bars respect the iPhone safe areas
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1c1530",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the platform script adds a class to <html> before React hydrates
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* A plain inline script, not next/script: it must run while the HTML is parsed, before the
            first paint, or Chrome on a Mac would briefly show Inter before switching to SF Pro */}
        <script dangerouslySetInnerHTML={{ __html: APPLE_PLATFORM_SCRIPT }} />
      </head>
      <body>
        <NoInspect />
        {children}
      </body>
    </html>
  );
}
