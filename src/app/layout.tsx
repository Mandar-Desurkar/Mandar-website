import type { Metadata } from "next";
import "./globals.css";
import NoInspect from "@/components/NoInspect";
import { profile } from "@/data/resume";

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: profile.metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NoInspect />
        {children}
      </body>
    </html>
  );
}
