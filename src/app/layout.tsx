import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import NoInspect from "@/components/NoInspect";
import { profile } from "@/data/resume";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JKRX4FZQRD";

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
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <NoInspect />
        {children}
      </body>
    </html>
  );
}
