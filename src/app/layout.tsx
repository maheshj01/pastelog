"use client";
import { useEffect } from 'react';

import { useTheme } from 'next-themes';
import { Inter } from "next/font/google";
import { Theme } from './_components/ThemeSwitcher';
import { useSidebar } from './_services/Context';
import LogService from "./_services/logService";
import "./globals.css";
import { Providers, SidebarProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { setSelected, showSideBar, setId, setShowSideBar } = useSidebar();
  const logService = new LogService();
  const { theme, setTheme } = useTheme();
  const checkWindowSize = async () => {
    if (typeof window !== 'undefined') {
      const currentURL = new URL(window.location.href);
      const id = currentURL.pathname.split('/').pop();
      if (id) {
        const log = await logService.fetchLogById(id);
        if (log) {
          setId(log.id!);
          setSelected(log);
        }
      }
      if (showSideBar && window.innerWidth <= 768) {
        console.log('Closing sidebar');
        setShowSideBar(false);
      }
    }
  };


  useEffect(() => {
    checkWindowSize();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      setTheme(Theme.DARK);
    } else {
      setTheme(Theme.LIGHT);
    }
    window.addEventListener('resize', checkWindowSize);
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);

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
