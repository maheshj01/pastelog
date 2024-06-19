"use client";

import PSNavbar from "../(main)/_components/PSNavbar";


export default function PublishLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <PSNavbar />
            {children}
        </div>
    );
}