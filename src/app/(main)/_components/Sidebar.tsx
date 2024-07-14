"use client";
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { Tooltip } from '@nextui-org/react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaGithub, FaGoogle } from "react-icons/fa";
import Log from "../_models/Log";
import Analytics from '../_services/Analytics';
import { AuthService } from '../_services/AuthService';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import PSDropdown from './Dropdown';
import IconButton from "./IconButton";
import ShortCutsGuide from './ShortcutsGuide';
import SidebarItem from './SideBarItem';
const Sidebar: React.FC = () => {
    const { id, setSelected, setId, showSideBar, user, setUser } = useSidebar();
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const router = useRouter();
    const authService = new AuthService();
    const logService = new LogService();
    const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

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

    const handleFirstTimeLogin = async (userId: string) => {
        setLoading(true);
        await logService.updateLogsForNewUser(userId);
        await fetchLogs(); // Refresh logs after updating
        setIsFirstLogin(false);
        setLoading(false);
    };

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            await logService.deleteExpiredLogs();
            if (user && user.uid) {
                const isFirstLogin = await authService.isFirstTimeLogin(user.uid);
                if (isFirstLogin) {
                    const logs = await logService.fetchLogsFromLocal();
                    setLogs(logs);
                } else {
                    const fetchedLogs = await logService.getLogsByUserId(user.uid)
                    setLogs(fetchedLogs);
                }
            } else {
                const logs = await logService.fetchLogsFromLocal();
                setLogs(logs);
            }
            setLoading(false);
        } catch (_) {
            console.log("Error fetching logs");
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
                fetchLogs();
            }
        });
        fetchLogs();
        return () => unsubscribe();
    }, [fetchLogs, refresh]);

    const handleRefresh = () => setRefresh(prev => !prev);

    const handleLogin = async () => {
        try {
            await authService.signInWithGoogle();
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.signOut();
            setUser(null);
            // Clear the logs state immediately
            setLogs([]);
            // Fetch logs from local storage after logout
            const localLogs = await logService.fetchLogsFromLocal();
            setLogs(localLogs);
            router.push('/logs');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };


    function UserLogin() {
        return (
            <div className='sticky bottom-0 bg-surface dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600'>
                {user ? (
                    <PSDropdown
                        options={['SignOut']}
                        placement="bottom-start"
                        onClick={handleLogout}
                        className="dropdown-class">
                        <div className='cursor-pointer'>
                            <Tooltip content={'Profile'}>
                                <Image src={user.photoURL!}
                                    height={36}
                                    width={36}
                                    alt={user.displayName!} className='rounded-full mr-2 border-1 border-white' />
                            </Tooltip>
                        </div>
                    </PSDropdown>
                ) : (
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <div>
                                <div className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg'
                                    onClick={handleLogin}>
                                    <FaGoogle className='size-6 text-black dark:text-white' />
                                </div>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent side='top' align='start' className="z-30 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300">
                            <div className="text-sm text-black dark:text-white">
                                Sign in to sync notes with cloud
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                )}
            </div>
        );
    }

    return (
        <div className={`fixed top-0 left-0 bottom-0 bg-surface dark:bg-gray-700 overflow-y-auto z-20`}>
            <div className={`flex flex-col h-full transition-width duration-700 ${showSideBar ? 'w-64' : 'w-0'}`}>
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
                {loading ? (
                    <div className={`flex items-center justify-center flex-grow ${showSideBar ? 'w-64' : 'w-0'}`}>
                        <div className="loader" />
                    </div>
                ) :
                    (<div className='overflow-y-auto flex-grow pb-2'>
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
                    )}
                <div className='flex px-2 items-center'>
                    <div>
                        <ShortCutsGuide />
                    </div>
                    <div className='flex flex-grow justify-end items-center space-x-1'>
                        <IconButton
                            ariaLabel='Github'
                            onClick={() => {
                                window.open(process.env.NEXT_PUBLIC_GITHUB_REPO ?? '', '_blank');
                            }}
                        >
                            <FaGithub className='size-6 text-black dark:text-white' />
                        </IconButton>
                        <UserLogin />
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Sidebar;