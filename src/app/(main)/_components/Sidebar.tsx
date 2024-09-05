"use client";
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FaBug, FaGithub, FaGoogle } from "react-icons/fa";
import Log from "../_models/Log";
import Analytics from '../_services/Analytics';
import { AuthService } from '../_services/AuthService';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
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
            router.push('/logs');
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
                    <Popover>
                        <PopoverTrigger>
                            <div className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full relative hover:scale-125 transition-all duration-300'>
                                {/* {!loading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
                                    </div>
                                )} */}
                                <Image
                                    src={user.photoURL!}
                                    alt="User profile"
                                    width={36}
                                    height={36}
                                    className="rounded-full"
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300">
                            <div className='shadow-md'>
                                <div className="flex items-center space-x-2 p-2">
                                    <Image
                                        src={user.photoURL!}
                                        alt="User profile"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-sm text-black dark:text-white">{user.displayName}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-300">{user.email}</div>
                                    </div>
                                </div>
                                <button
                                    className="mt-4 w-full py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg'>
                                <div className='cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg'
                                    onClick={handleLogin}
                                >
                                    <FaGoogle className='size-6 text-black dark:text-white' />
                                </div>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-60 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300">
                            <div className="text-sm text-black dark:text-white">
                                Sign in to sync notes with cloud
                            </div>
                            <button
                                className="mt-4 w-full py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                onClick={handleLogin}
                            >
                                <FaGoogle className='inline-block mr-2' /> Sign in with Google
                            </button>
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
                <div className='flex items-center justify-evenly'>
                    <ShortCutsGuide />
                    <IconButton
                        ariaLabel='Report a Bug'
                        onClick={() => {
                            window.open(`${process.env.NEXT_PUBLIC_GITHUB_REPO}/issues/new`, '_blank');
                        }}
                    >
                        <FaBug className='size-6 text-black dark:text-white' />
                    </IconButton>
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
    );
};

export default Sidebar;