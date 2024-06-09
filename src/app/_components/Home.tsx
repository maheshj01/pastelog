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

export default function Home() {
    const [showSideBar, setShowSideBar] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLog, setSelectedLog] = useState<string | null>(null);

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
    const { theme } = useTheme();

    useEffect(() => {
        fetchLogs();
        checkWindowSize();
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    }, []);

    return (
        <div className={`flex h-screen ${theme == Theme.DARK ? 'darkTheme' : 'lightTheme'}`}>
            {
                (showSideBar && <IconButton
                    className={`fixed top-2 left-2 z-30 ${showSideBar ? '' : 'ml-0'}`}
                    onClick={() => setShowSideBar(!showSideBar)}
                    ariaLabel="Toggle sidebar"
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
                        onLogClick={(id) => {
                            console.log(id);
                            if (id) {
                                setSelectedLog(id!);
                            } else {
                                setSelectedLog(null);
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
                        selectedLog ? (<Preview
                            id={selectedLog}
                            showNavbar={false}
                        />) :
                            (<Pastelog />)
                    }
                </div>
            </div>
        </div>
    );
}