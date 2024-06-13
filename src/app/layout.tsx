"use client";

import { useTheme } from 'next-themes';
import { Inter } from "next/font/google";
import { Theme } from './_components/ThemeSwitcher';
import "./globals.css";
import { Providers, SidebarProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background dark:bg-gray-600 ${theme == Theme.DARK ? 'darkTheme' : 'lightTheme'}`}>
        <Providers>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
