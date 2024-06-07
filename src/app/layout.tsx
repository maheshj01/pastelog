import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pastelog",
  description: "PasteLog is a simple, fast, and powerful pastebin. It is powered by firebase in the backend. It allows you to publish your logs, and access them from anywhere and any device via a unique link.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background dark:bg-gray-600`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
