"use client";

import { PSNavbarProvider } from "@/lib/Context/PSNavbarProvider";
import PSNavbar from "../(main)/_components/PSNavbar";

export default function PublishLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <PSNavbarProvider>
                <PSNavbar />
                {children}
            </PSNavbarProvider>
        </div>
    );
}