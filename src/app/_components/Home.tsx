"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import IconButton from "./IconButton";
import PSNavbar from "./PSNavbar";
import Pastelog from "./Pastelog";
import { Theme } from './ThemeSwitcher';

export default function Home() {
    const [showSideBar, setShowSideBar] = useState<boolean>(true);

    const checkWindowSize = () => {
        if (typeof window !== 'undefined') {
            if (showSideBar && window.innerWidth <= 768) {
                setShowSideBar(false);
            }
        }
    };
    const { theme } = useTheme();

    useEffect(() => {
        checkWindowSize();
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    }, []);

    return (
        <div className={`flex h-screen ${theme == Theme.DARK ? 'darkTheme' : 'lightTheme'}`}>
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
                className={`fixed top-0 left-0 bottom-0 bg-surface overflow-y-auto transition-width duration-1000 ${showSideBar ? 'w-64' : 'w-0'
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