"use client";
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    const { id, setSelected, setId, showSideBar, user, setUser } = useSidebar();
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const router = useRouter();
    const [hasMore, setHasMore] = useState<boolean>(true);
    const authService = new AuthService();
    const logService = new LogService();
    const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const initialFetchDone = useRef<boolean>(false);

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

    const fetchLogs = useCallback(async (pageNumber: number = 1, isRefresh: boolean = false) => {
        console.log("fetching logs:");
        if (isFetching) return;
        setIsFetching(true);
        setLoading(true);
        try {
            await logService.deleteExpiredLogs();
            let fetchedLogs: Log[] = [];
            if (user && user.uid) {
                const isFirstLogin = await authService.isFirstTimeLogin(user.uid);
                if (isFirstLogin) {
                    fetchedLogs = await logService.fetchLogsFromLocal();
                } else {
                    fetchedLogs = await logService.getLogsByUserId(user.uid, pageNumber); // Add pagination to this method
                }
            } else {
                fetchedLogs = await logService.fetchLogsFromLocal();
            }

            if (isRefresh) {
                setLogs(fetchedLogs);
            } else {
                setLogs(prevLogs => [...prevLogs, ...fetchedLogs]);
            }

            setHasMore(fetchedLogs.length > 0); // Update hasMore based on fetched results
            setLoading(false);
        } catch (_) {
            setLoading(false);
        } finally {
            setIsFetching(false);
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((newUser) => {
            setUser(newUser);
            if (newUser && !initialFetchDone.current) {
                fetchLogs(1, true);
                setPage(1);
                initialFetchDone.current = true;
            }
        });

        if (!initialFetchDone.current) {
            fetchLogs(1, true);
            initialFetchDone.current = true;
        }

        return () => unsubscribe();
    }, [fetchLogs, setUser]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && (user && user.uid)) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (logsEndRef.current) {
            observer.observe(logsEndRef.current);
        }

        return () => {
            if (logsEndRef.current) {
                observer.unobserve(logsEndRef.current);
            }
        };
    }, [hasMore, loading]);


    useEffect(() => {
        if (page > 1) {
            fetchLogs(page);
        }
    }, [page, fetchLogs]);

    const handleRefresh = useCallback(() => {
        setRefresh(prev => !prev);
        setPage(1);
        fetchLogs(1, true);
    }, [fetchLogs]);

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
            setLogs([]);
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
                {
                    // loading ? (
                    //     <div className={`flex items-center justify-center flex-grow ${showSideBar ? 'w-64' : 'w-0'}`}>
                    //         <div className="loader" />
                    //     </div>
                    // ) :

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
                        {loading && <div className="flex justify-center items-center">
                            <p> Loading...</p>
                        </div>}
                        <div ref={logsEndRef} style={{ height: '20px' }} />
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