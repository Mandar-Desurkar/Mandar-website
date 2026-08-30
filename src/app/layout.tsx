import type { Metadata } from "next";
import { Caveat, VT323 } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-system",
});

export const metadata: Metadata = {
  title: "Mandar Desurkar | Product Pioneer",
  description: "Product Manager executing strategy with a 90s builder mentality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} ${vt323.variable}`}>
        {children}
      </body>
    </html>
  );
}
