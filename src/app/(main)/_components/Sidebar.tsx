"use client";
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Log from "../_models/Log";
import Analytics from '../_services/Analytics';
import { AuthService } from '../_services/AuthService';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import IconButton from "./IconButton";
import LoginMenu from './LoginMenu';
import ShortCutsGuide from './ShortcutsGuide';
import SidebarItem from './SideBarItem';

const Sidebar: React.FC = () => {
    const { id, setSelected, setId, showSideBar, user, setUser, setShowSideBar } = useSidebar();
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const router = useRouter();
    const authService = new AuthService();
    const logService = new LogService();
    const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

    const onLogClick = useCallback((log: Log | null) => {
        if (log) {
            setSelected(log);
            setId(log.id!);
            router.push(`/logs/${log.id}`);
            Analytics.logEvent('change_log', { id: log.id, action: 'click' });
            if (window.innerWidth <= 640) {
                setShowSideBar(false);
            }
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
                {/* <SettingsDialog /> */}
                <div className='flex items-center justify-between bg-surface dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600 px-2 py-2'>
                    <ShortCutsGuide />
                    <LoginMenu onLogOut={handleLogout} onLogin={handleLogin} loading={loading} onSettings={() => {
                        router.push('/settings');
                    }} />
                </div>
            </div>

        </div>
    );
};

export default Sidebar;