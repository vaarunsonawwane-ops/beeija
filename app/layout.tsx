import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beeija.com"),

  title: {
    default: "Beeija",
    template: "%s | Beeija",
  },

  description:
    "Practical tools for AI, cloud, infrastructure, cost estimation, and technical planning.",

  applicationName: "Beeija",

  openGraph: {
    type: "website",
    url: "https://beeija.com",
    siteName: "Beeija",
    title: "Beeija",
    description:
      "Practical tools for AI, cloud, infrastructure, cost estimation, and technical planning.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Beeija",
    description:
      "Practical tools for AI, cloud, infrastructure, cost estimation, and technical planning.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
