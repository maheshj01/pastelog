"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SettingsList from "../_components/SettingsList";

const SettingsPage: React.FC = () => {
    const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const handleSettingSelect = (setting: string) => {
        setSelectedSetting(setting);
    };

    const renderSettingsContent = () => {
        if (!selectedSetting) {
            return (
                <div className="p-6 text-center text-gray-500">
                    Select a setting to view details
                </div>
            );
        }
        // Placeholder for settings content
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{selectedSetting}</h2>
                <p>Settings details for {selectedSetting} go here.</p>
            </div>
        );
    };

    const checkWindowSize = async () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                setIsSmallScreen(true);
            } else {
                setIsSmallScreen(false);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', checkWindowSize);
    });
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center p-4 bg-background border-b-1 border-gray-400">
                <h1 className="text-xl font-bold">Account settings</h1>
                <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                    Close
                </button>
            </div>
            <div className='flex min-h-screen'>
                <SettingsList onSettingSelect={handleSettingSelect} />
                <div className="w-full sm:w-2/3">
                    {renderSettingsContent()}
                </div>
            </div>
        </div >
    );
};

export default SettingsPage;