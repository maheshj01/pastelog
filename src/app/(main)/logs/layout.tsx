"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import IconButton from "../_components/IconButton";
import PSNavbar from '../_components/PSNavbar';
import Sidebar from '../_components/Sidebar';
import { Theme } from '../_components/ThemeSwitcher';
import { useSidebar } from '../_services/Context';

export default function LogsLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();
    const { showSideBar, setShowSideBar } = useSidebar();
    const [show, setShow] = React.useState(true);
    const checkWindowSize = async () => {
        if (typeof window !== 'undefined') {
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
        <div className={`flex ${theme === Theme.DARK ? 'dark' : 'light'}`}>
            <div className={`fixed top-0 left-0 z-50 h-screen overflow-y-auto ${showSideBar ? 'w-64' : 'w-0'}`}>
                <Sidebar />
            </div>
            <div className={`flex-grow w-full overflow-x-hidden transition-all duration-200 ${showSideBar ? 'pl-64' : 'pl-0'}`}>
                {showSideBar && (
                    <IconButton
                        className={`fixed top-2 left-2 z-50`}
                        onClick={() => setShowSideBar(!showSideBar)}
                        ariaLabel="Close Sidebar"
                        tooltipPlacement="bottom-start"
                    >
                        <ViewSidebarRoundedIcon />
                    </IconButton>
                )}
                <div className="relative z-40 h-screen overflow-y-auto">
                    <div className="flex flex-col min-h-full">
                        {/* <Banner
                            className='sticky top-0 z-40'
                            show={show}
                            message="Pastelog is under maintenance, Your existing logs won't be accessible, But you can still publish new logs" >
                            <div className='px-2'>
                                <IconButton
                                    ariaLabel='Close Banner'
                                    onClick={() => setShow(false)}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        </Banner> */}
                        <PSNavbar
                            className='sticky top-0 z-40'
                            sideBarIcon={!showSideBar} />
                        <main className="flex-grow">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
