"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useState } from 'react';
import IconButton from "./IconButton";
import PSNavbar from "./PSNavbar";
import Pastelog from "./Pastelog";

export default function Home() {
    const [showSideBar, setShowSideBar] = useState<boolean>(true);

    return (
        <div className="flex h-screen">
            {/* Sidebar toggle button */}
            <IconButton
                className={`fixed top-2 left-2 z-30 ${showSideBar ? '' : 'ml-0'}`}
                onClick={() => setShowSideBar(!showSideBar)}
                ariaLabel="Toggle sidebar"
            >
                <ViewSidebarRoundedIcon />
            </IconButton>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 bottom-0 bg-slate-200 dark:bg-gray-500 overflow-y-auto transition-width duration-1000 ${showSideBar ? 'w-64' : 'w-0'
                    }`}
            >
                {showSideBar && (
                    <div className="pt-16">
                        <p>Sidebar content goes here</p>
                    </div>
                )}
            </div>

            {/* Main content */}
            <div className={`grow overflow-y-auto transition-all duration-800 ${showSideBar ? 'pl-64' : 'pl-0'}`}>
                <div className="flex flex-col h-full">
                    <PSNavbar
                        sideBarIcon={!showSideBar}
                        onToggleSidebar={() => setShowSideBar(!showSideBar)}
                    />
                    <Pastelog />
                </div>
            </div>
        </div>
    );
}