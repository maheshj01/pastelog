"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useTheme } from 'next-themes';
import IconButton from "../_components/IconButton";
import PSNavbar from '../_components/PSNavbar';
import Sidebar from '../_components/Sidebar';
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

    return (
        <div className={`flex light`}>
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
                        <PSNavbar sideBarIcon={!showSideBar} />
                        <main className="flex-grow">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
