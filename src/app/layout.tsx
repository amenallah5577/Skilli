import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeScript } from "@/components/theme/ThemeScript";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"]
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "Skilli | Teach what you know. Learn what you need.",
  description:
    "A Tunisian skill exchange platform for peer-to-peer learning, session booking, realtime chat, reviews, and points.",
  metadataBase: new URL("https://skilli.local")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${dmSans.variable} ${cormorant.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
