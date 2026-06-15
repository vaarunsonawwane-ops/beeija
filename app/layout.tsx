import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beeija.com"),

  title: {
    default: "Beeija | Practical AI, Cloud & Cost Planning Tools",
    template: "%s | Beeija",
  },

  description:
    "Practical browser-based tools for estimating AI, cloud, infrastructure, and technical costs before you build.",

  applicationName: "Beeija",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beeija.com",
    siteName: "Beeija",
    title: "Beeija | Practical AI, Cloud & Cost Planning Tools",
    description:
      "Practical browser-based tools for estimating AI, cloud, infrastructure, and technical costs before you build.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Beeija | Practical AI, Cloud & Cost Planning Tools",
    description:
      "Practical browser-based tools for estimating AI, cloud, infrastructure, and technical costs before you build.",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} flex min-h-screen flex-col bg-white antialiased`}
      >
        <Header />

        <div className="flex-1">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
