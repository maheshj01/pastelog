import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from './(main)/_components/ThemeProvider';
import ToastProvider from "./(main)/_components/ToastProvider";
import "./globals.css";
import { Providers, SidebarProvider } from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pastelog",
  applicationName: "Pastelog",
  description: "Create Stunning Rich Text Logs/Notes with markdown Support and Code Highlighting and share it with the world.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pastelog",
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Pastelog",
    title: {
      default: "Pastelog",
      template: "%s | Pastelog",
    },
    images: [
      {
        url: "/images/frame.png",
        width: 512,
        height: 512,
        alt: "Pastelog",
      },
    ],
    description: "Create Stunning Rich Text Logs/Notes with markdown Support and Code Highlighting and share it with the world.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.ico" />
      </head>
      <body
        className={`${inter.className}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={['purple', 'red', 'blue', 'green', 'dark']}
            disableTransitionOnChange>
            <SidebarProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </SidebarProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
