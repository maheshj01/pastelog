"use client";

import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import { FiSidebar } from "react-icons/fi";
import IconButton from "../_components/IconButton";
import PSBanner from '../_components/PSBanner';
import PSNavbar from '../_components/PSNavbar';
import RouteClient from '../_components/RouteClient';
import ShortcutWrapper from '../_components/ShortCutWrapper';
import Sidebar from '../_components/Sidebar';
import { Theme } from '../_components/ThemeSwitcher';
import { useSidebar } from '../_hooks/useSidebar';
import useBannerState from '../_services/BannerState';

export default function LogsLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();
    const { showSideBar, toggleSideBar, setShowSideBar } = useSidebar();
    const bannerState = useBannerState();
    const [show, setShow] = React.useState(true);
    const router = useRouter();

    const checkWindowSize = async () => {
        if (typeof window !== 'undefined') {
            if (showSideBar && window.innerWidth <= 768) {
                setShowSideBar(false);
            }
        }
    };
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleMainContentClick = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768 && showSideBar) {
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
    }, [setTheme]);

    const handleShortCut = (key: string) => {
        switch (key) {
            case 'n':
                router.push('/logs');
                break;
            case 'd':
                toggleTheme();
                break;
            case 's':
                toggleSideBar();
                break;
            default:
                break;
        }
    };

    return (
        <ShortcutWrapper onShortCutClick={handleShortCut} >
            <div className={`flex ${theme === Theme.DARK ? 'dark' : 'light'}`}>
                <div className={`fixed top-0 left-0 z-50 h-screen overflow-y-auto ${showSideBar ? 'w-64' : 'w-0'} transition-all duration-300`}>
                    <Sidebar />
                </div>
                <div className={`flex-grow w-full overflow-x-hidden transition-all duration-300 ease-in-out ${showSideBar ? 'pl-64' : 'pl-0'} `} onPointerDown={handleMainContentClick}>
                    {showSideBar && (
                        <IconButton
                            className={`fixed top-2 left-2 z-50`}
                            onClick={() => setShowSideBar(!showSideBar)}
                            ariaLabel="Close Sidebar"
                            tooltipPlacement="bottom-start"
                        >
                            <FiSidebar className="text-2xl" />
                        </IconButton>
                    )}
                    <div className={`relative z-40 h-screen overflow-y-auto transition-all duration-300 ease-in-out  ${showSideBar ? 'slide-main' : ''}`}>
                        <div className="flex flex-col min-h-full">
                            <PSBanner
                                key={`${bannerState.show}-${bannerState.message}`}
                                className="sticky top-0 z-40"
                                show={show}
                                message="Pastelog is under maintenance, Your existing logs won't be accessible, But you can still publish new logs">
                                <div className='px-2'>
                                    <IconButton
                                        ariaLabel='Close Banner'
                                        onClick={() => setShow(false)}>
                                        <ClearIcon />
                                    </IconButton>
                                </div>
                            </PSBanner>
                            <PSNavbar
                                className='sticky top-0 z-40'
                                sideBarIcon={!showSideBar} />
                            <main className="flex-grow">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>

                <Suspense fallback={<div className='flex min-h-screen items-center justify-center'>Loading...</div>}>
                    <RouteClient />
                </Suspense>
            </div>
        </ShortcutWrapper >
    );
}
