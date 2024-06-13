"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from './_components/ThemeProvider';
import "./globals.css";
import { Providers, SidebarProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={['purple', 'red', 'blue', 'green', 'dark']}
            disableTransitionOnChange
          >
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
