"use client";

import PSNavbar from "../../(main)/_components/PSNavbar";


export default function PolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <PSNavbar />
            {children}
        </div>
    );
}