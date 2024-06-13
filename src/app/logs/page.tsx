"use client";

import Pastelog from "../_components/Pastelog";
import { useSidebar } from '../_services/Context';

export default function LogsPage() {
    const { showSideBar, setShowSideBar, id } = useSidebar();
    return (
        <div className={`grow`}>
            {/* Main content */}
            <div className="flex flex-col h-full">
                <Pastelog />
            </div>
        </div>
    );
}