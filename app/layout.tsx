import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

import QueryProvider from "@/providers/query-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHOPPFD",
  description: "Your all in one place for everything bags",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ClerkProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}