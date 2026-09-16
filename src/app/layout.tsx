import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MinPreps",
    template: "%s | MinPreps",
  },
  description:
    "Utah high school basketball scores, stats, standings, and rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // scroll-pt keeps anchored content from hiding under the sticky header.
      className={`${GeistSans.variable} h-full scroll-pt-16 antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
