import { ChevronRightIcon } from '@radix-ui/react-icons';
import React from 'react';

interface SettingsListProps {
    onSettingSelect: (setting: string) => void;
}

const SettingsList: React.FC<SettingsListProps> = ({ onSettingSelect }) => {
    const settingsItems = [
        { title: 'Profile', href: '/settings/profile' },
        { title: 'Account and security', href: '/settings/account' },
        { title: 'Notifications', href: '/settings/notifications' },
        { title: 'Language', href: '/settings/language' },
        { title: 'Help', href: '/settings/help' },
    ];

    return (
        <div className="py-4 px-2 bg-surface dark:bg-gray-700 ">
            <ul className="space-y-2">
                {settingsItems.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={() => onSettingSelect(item.title)}
                            className="w-full flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors duration-150 ease-in-out"
                        >
                            <span className="text-md text-left">{item.title}</span>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400 hidden md:block" />
                        </button>
                    </li>
                ))}
            </ul>
            <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-background rounded-lg transition-colors duration-150 ease-in-out">
                <button className="text-red-600 font-semibold">Log out</button>
            </div>
        </div>
    );
};

export default SettingsList;