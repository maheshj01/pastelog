"use client";

import { PSNavbarProvider } from "@/lib/Context/PSNavbarProvider";
import PSNavbar from "../../(main)/_components/PSNavbar";


export default function PolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <PSNavbarProvider>
            <div className="flex flex-col">
                <PSNavbar />
                {children}
            </div>
        </PSNavbarProvider>
    );
}