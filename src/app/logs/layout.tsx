"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useTheme } from 'next-themes';
import IconButton from "../_components/IconButton";
import Sidebar from '../_components/Sidebar';
import { Theme } from '../_components/ThemeSwitcher';
import { useSidebar } from '../_services/Context';

export default function LogsLayout({ children }: { children: React.ReactNode }) {
    const { showSideBar, setShowSideBar, id } = useSidebar();
    const { theme } = useTheme();
    return (
        <div className={`flex ${theme == Theme.DARK ? 'darkTheme' : 'lightTheme'}`}>
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
            <Sidebar />
            <div className="grow w-full">{children}</div>
        </div>
    );
}