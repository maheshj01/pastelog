import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from './(main)/_components/ThemeProvider';
import ToastProvider from "./(main)/_components/ToastProvider";
import "./globals.css";
import { Providers, SidebarProvider } from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pastelog",
  description: "Create Stunning Rich Text Logs/Notes with markdown Support and Code Highlighting and share it with the world.",
  manifest: "/web.manifest",
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
            disableTransitionOnChange
          >
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
