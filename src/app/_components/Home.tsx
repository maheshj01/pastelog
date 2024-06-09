"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Log from '../_models/Log';
import LogService from '../_services/logService';
import IconButton from "./IconButton";
import PSNavbar from "./PSNavbar";
import Pastelog from "./Pastelog";
import Preview from './Preview';
import Sidebar from './Sidebar';
import { Theme } from './ThemeSwitcher';

export default function Home({ id }: { id: string | null }) {
    const [showSideBar, setShowSideBar] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(id);

    async function fetchLogs() {
        setLoading(true);
        const logService = new LogService();
        const logs = await logService.fetchLogs();
        setLogs(logs);
        setLoading(false);
    }
    const checkWindowSize = () => {
        if (typeof window !== 'undefined') {
            if (showSideBar && window.innerWidth <= 768) {
                setShowSideBar(false);
            }
        }
    };
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        fetchLogs();
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
        <div className={`flex h-screen ${theme == Theme.DARK ? 'darkTheme' : 'lightTheme'}`}>
            {
                (showSideBar && <IconButton
                    className={`fixed top-2 left-2 z-30 ${showSideBar ? '' : 'ml-0'}`}
                    onClick={() => setShowSideBar(!showSideBar)}
                    ariaLabel="Close Sidebar"
                    tooltipPlacement='bottom-start'
                >
                    <ViewSidebarRoundedIcon />
                </IconButton>
                )
            }

            <div
                className={`fixed top-0 left-0 bottom-0 bg-surface overflow-y-auto transition-width duration-1000 ${showSideBar ? 'w-64' : 'w-0'
                    }`}>
                {showSideBar && (
                    <Sidebar
                        loading={loading}
                        logs={logs}
                        id={selectedLogId}
                        onLogClick={(id) => {
                            console.log(id);
                            if (id) {
                                setSelectedLogId(id!);
                            } else {
                                setSelectedLogId(null);
                            }
                        }}
                    />
                )}
            </div>

            {/* Main content */}
            <div className={`grow overflow-y-auto transition-all duration-800 ${showSideBar ? 'pl-64' : 'pl-0'}`}>
                <div className="flex flex-col h-full">
                    <PSNavbar
                        sideBarIcon={!showSideBar}
                        onToggleSidebar={() => setShowSideBar(!showSideBar)}
                    />
                    {
                        selectedLogId ? (<Preview
                            id={selectedLogId}
                            showNavbar={false}
                        />) :
                            (<Pastelog />)
                    }
                </div>
            </div>
        </div>
    );
}