"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import IconButton from "../_components/IconButton";
import Sidebar from '../_components/Sidebar';
import { Theme } from '../_components/ThemeSwitcher';
import { useSidebar } from '../_services/Context';

export default function LogsLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();

    const { showSideBar, setShowSideBar } = useSidebar();

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
        <div className={`flex ${theme == Theme.DARK ? 'darkTheme' : 'lightTheme'}`}>
            {
                (showSideBar && <IconButton
                    className={`fixed top-2 left-2 z-30 ${showSideBar ? '' : 'ml-0'}`}
                    onClick={() => {
                        setShowSideBar(!showSideBar)
                    }}
                    ariaLabel="Close Sidebar"
                    tooltipPlacement='bottom-start'
                >
                    <ViewSidebarRoundedIcon />
                </IconButton>
                )
            }
            <div className='z-10'>
                <Sidebar />
            </div>
            <div className="grow w-full">{children}</div>
        </div>
    );
}