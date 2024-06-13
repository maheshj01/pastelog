"use client";

import PSNavbar from "../_components/PSNavbar";
import Pastelog from "../_components/Pastelog";
import { useSidebar } from '../_services/Context';

export default function LogsPage() {
    const { showSideBar, setShowSideBar, id } = useSidebar();
    return (
        <div className={`grow`}>
            {/* Main content */}
            <div className={`transition-all duration-800 ${showSideBar ? 'pl-64' : 'pl-0'}`}>
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