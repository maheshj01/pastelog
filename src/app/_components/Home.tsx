"use client";

import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { useState } from 'react';
import IconButton from "./IconButton";
import PSNavbar from "./PSNavbar";
import Pastelog from "./Pastelog";

export default function Home() {
    const [showSideBar, setShowSideBar] = useState<boolean>(true);

    return (
        <div className="flex">
            {/* sidebar */}
            {showSideBar && (
                <IconButton
                    className='absolute top-2 left-2 z-30'
                    onClick={() => {
                        setShowSideBar(!showSideBar);
                    }}
                    ariaLabel="Toggle sidebar"
                >
                    <ViewSidebarRoundedIcon />
                </IconButton>
            )}

            {/* Sidebar content goes here */}
            <div className={`bg-slate-200 dark:bg-gray-500 ${showSideBar ? 'w-64' : 'w-0'} transition-width duration-1000 pt-16 overflow-y-auto`}>
                {/* Add your sidebar content here */}
                {
                    showSideBar && (

                        <p>Sidbar content goes here</p>
                    )
                }
            </div>

            <div className="grow">
                <div className='flex flex-col'>
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
