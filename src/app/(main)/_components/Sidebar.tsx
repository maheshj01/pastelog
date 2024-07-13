"use client";
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import Log from "../_models/Log";
import Analytics from '../_services/Analytics';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import IconButton from "./IconButton";
import SidebarItem from './SideBarItem';

const Sidebar: React.FC = () => {
    const { id, setSelected, setId, showSideBar } = useSidebar();
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const router = useRouter();

    const onLogClick = useCallback((log: Log | null) => {
        if (log) {
            setSelected(log);
            setId(log.id!);
            router.push(`/logs/${log.id}`);
            Analytics.logEvent('change_log', { id: log.id, action: 'click' });
        } else {
            setSelected(null);
            setId(null);
            router.push(`/logs`);
            Analytics.logEvent('new_log');
        }
    }, []);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        const logService = new LogService();
        await logService.deleteExpiredLogs();
        const logs = await logService.fetchLogsFromLocal();
        setLogs(logs);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs, refresh]);
    const ShortcutsMap = [
        { keys: 'Ctrl + M', description: 'Toggle Preview' },
        { keys: 'Ctrl + P', description: 'Toggle Sidebar' },
        { keys: 'Ctrl/Cmd + B', description: 'Bold' },
        { keys: 'Ctrl/Cmd + I', description: 'Italic' },
        { keys: 'Ctrl/Cmd + Shift + X', description: 'Strikethrough' },
        { keys: 'Ctrl/Cmd + Shift + [1-6]', description: 'Heading' },
        { keys: 'Ctrl/Cmd + K', description: 'Link' },
        { keys: 'Ctrl/Cmd + E', description: 'Code' },
        { keys: 'Ctrl/Cmd + Shift + C', description: 'Code Block' },
        { keys: 'Ctrl/Cmd + U', description: 'Unordered List' },
        { keys: 'Ctrl/Cmd + Shift + O', description: 'Ordered List' },
        { keys: 'Ctrl/Cmd + Shift + .', description: 'Blockquote' },
        { keys: 'Ctrl/Cmd + Shift + -', description: 'Horizontal Rule' },
        { keys: 'Tab / Shift + Tab', description: 'Indent/Unindent Code Block' },
    ]

    function ShortCutsGuide() {
        return (<HoverCard>
            <HoverCardTrigger asChild>
                <div className='cursor-pointer'>
                    <MdOutlineKeyboardCommandKey className='size-6 text-black dark:text-white' />
                </div>
            </HoverCardTrigger>
            <HoverCardContent side='top' align='start' className="z-30">
                <div className="p-4 bg-white dark:bg-gray-950 shadow-lg rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-bold"> Keyboard Shortcuts</div>
                    </div>
                    <div className="mt-2">
                        {[...Array(ShortcutsMap.length)].map((_, index) => {
                            const shortcut: any = ShortcutsMap[index];
                            return (
                                <div key={index}>
                                    {index === 2 && <p className='text-md my-2 font-bold'>Markdown Shortcuts</p>}
                                    <div className="flex justify-between">
                                        <div className="flex space-x-2">
                                            <MdOutlineKeyboardCommandKey className='text-black dark:text-white' />
                                            <span className="text-sm">{shortcut.keys}</span>
                                        </div>
                                        <span className="text-sm">{shortcut.description}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
        );
    }

    const handleRefresh = () => setRefresh(prev => !prev);
    return (
        <div className={`fixed top-0 left-0 bottom-0 bg-surface dark:bg-gray-700 overflow-y-auto z-20`}>
            {loading ? (
                <div className={`flex items-center justify-center min-h-screen ${showSideBar ? 'w-64' : 'w-0'}`}>
                    <div className="loader" /> {/* You can replace this with a proper loading spinner */}
                </div>
            ) : (<div className={`flex flex-col h-full transition-width duration-700 ${showSideBar ? 'w-64' : 'w-0'}`}>
                {/* Fixed IconButton */}
                <div className='sticky top-0 z-10 pt-2 pb-2'>
                    <div className='flex justify-end pr-4'>
                        <IconButton
                            ariaLabel="New Pastelog"
                            onClick={() => onLogClick(null)}
                        >
                            <PencilSquareIcon className='size-6 text-black dark:text-white' />
                        </IconButton>
                    </div>
                </div>

                {/* Scrollable logs list */}
                <div className='overflow-y-auto flex-grow pb-4'>
                    {logs.map((log: Log) => (
                        <SidebarItem
                            id={log.id!}
                            selected={id === log.id}
                            log={log}
                            key={log.id}
                            className={id === log.id ? 'hover:bg-background' : 'hover:dark:bg-slate-600 hover:bg-slate-300 '}
                            onLogClick={() => onLogClick(log)}
                            onRefresh={handleRefresh} // Pass the refresh function
                        />
                    ))}
                </div>
                <div className='flex justify-between px-4 items-center'>
                    <IconButton
                        ariaLabel='Github'
                        onClick={() => {
                            window.open(process.env.NEXT_PUBLIC_GITHUB_REPO ?? '', '_blank');
                        }}
                    >
                        <FaGithub className='size-6 text-black dark:text-white' />
                    </IconButton>
                    <div>
                        <ShortCutsGuide />
                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default Sidebar;
