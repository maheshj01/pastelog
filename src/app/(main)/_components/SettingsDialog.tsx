"use client";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import SettingsList from "./SettingsList";

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
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

    return (
        <Modal size={isSmallScreen ? "full" : "2xl"} isOpen={isOpen} onClose={onClose}
            closeButton={true}
            hideCloseButton={true}
            isDismissable={true}>
            <ModalContent>
                <div className="flex justify-between items-center p-4 bg-background border-b-1 border-gray-400">
                    <h1 className="text-xl font-bold">Account settings</h1>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        Close
                    </button>
                </div>
                <ModalBody className="flex flex-col sm:flex-row p-0 bg-background">
                    <div className="w-full sm:w-1/3">
                        <SettingsList onSettingSelect={handleSettingSelect} />
                    </div>
                    <div className="w-full sm:w-2/3">
                        {renderSettingsContent()}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SettingsDialog;