import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NoInspect from "@/components/NoInspect";
import Haptics from "@/components/Haptics";
import { profile, skills } from "@/data/resume";
import { SITE_URL } from "@/data/site";

// Typography: Apple devices render Apple's own system font, SF Pro (its licence doesn't allow
// serving it as a web font). Everyone else gets Inter, the closest open-source match, self-hosted
// by next/font. See --font-system in globals.css.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// Marks Apple platforms before the first paint so --font-system can pick SF Pro there. Needed
// because Chrome on a Mac only reaches SF Pro through system-ui, which on Android/Windows is
// Roboto/Segoe UI; Safari and iOS are also covered without JS by @supports in globals.css.
const APPLE_PLATFORM_SCRIPT = `try{var p=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||"";if(/mac|iphone|ipad|ipod/i.test(p)||/iPhone|iPad|iPod/.test(navigator.userAgent))document.documentElement.classList.add("apple")}catch(e){}`;


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} | ${profile.role}`,
  description: profile.metaDescription,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    profile.name,
    profile.role,
    "Product Manager",
    "AI product manager",
    "0→1 products",
    "consumer apps",
    "growth",
    "portfolio",
    "case studies",
    "Bangalore",
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // The plain-text summary for AI assistants (llms.txt) and the full text (llms-full.txt)
  alternates: { canonical: "/", types: { "text/plain": [{ url: "/llms.txt", title: "llms.txt" }, { url: "/llms-full.txt", title: "llms-full.txt" }] } },
  // Link previews on LinkedIn, WhatsApp and Slack; the images come from opengraph-image.tsx
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: `${profile.name} | ${profile.role}`,
    description: profile.metaDescription,
  },
  twitter: { card: "summary_large_image", title: `${profile.name} | ${profile.role}`, description: profile.metaDescription },
};

// Structured data: the person (name, role, employer, school, skills, profiles), the site, and the home
// page as their profile page, so search engines and AI assistants can tell who this site is about
const PERSON_ID = `${SITE_URL}/#person`;
const PERSON_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: profile.name,
      jobTitle: profile.role,
      description: profile.summary,
      url: SITE_URL,
      image: `${SITE_URL}/profile-photo.jpg`,
      email: `mailto:${profile.email}`,
      worksFor: { "@type": "Organization", name: "Silo Fortune" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "M. S. Ramaiah Institute of Technology" },
      address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
      knowsAbout: skills.flatMap((s) => s.items.split(", ")),
      sameAs: [profile.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${profile.name} Portfolio`,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: `${profile.name} | ${profile.role}`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": PERSON_ID },
    },
  ],
});

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PERSON_JSON_LD.replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <NoInspect />
        <Haptics />
        {children}
      </body>
    </html>
  );
}
