'use client';
import { Constants } from '@/app/constants';
import { useNavbar } from '@/lib/Context/PSNavbarProvider';
import { mapFirebaseUserToUser, setUser, signInWithGoogle, signOut } from '@/lib/features/menus/authSlice';
import { fetchLogs, fetchLogsFromLocal, setId, setLogs, setSelected, setShowSideBar } from '@/lib/features/menus/sidebarSlice';
import { AppDispatch, RootState } from '@/lib/store';
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Analytics from '../_services/Analytics';
import { AuthService } from '../_services/AuthService';
import { SearchDialog } from './Dialog/SearchDialog';
import IconButton from './IconButton';
import LoginMenu from './LoginMenu';
import ShortCutsGuide from './ShortcutsGuide';
import SidebarItem from './SideBarItem';
import { ThemeSwitcher } from './ThemeSwitcher';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.sidebar.loading);
    const logs = useSelector((state: RootState) => state.sidebar.logs);
    const [refresh, setRefresh] = useState<boolean>(false);
    const router = useRouter();
    const authService = new AuthService();
    const { setNavbarTitle } = useNavbar();
    const showSideBar = useSelector((state: RootState) => state.sidebar.showSideBar);
    const id = useSelector((state: RootState) => state.sidebar.id);

    const onLogClick = useCallback((log: any | null) => {
        if (log) {
            dispatch(setSelected(log));
            setNavbarTitle('');
            dispatch(setId(log.id!));
            router.push(`/logs/${log.id}`);
            Analytics.logEvent('change_log', { id: log.id, action: 'click' });
            if (window.innerWidth <= 640) {
                dispatch(setShowSideBar(false));
            }
        } else {
            dispatch(setSelected(null));
            dispatch(setId(null));
            router.push('/logs');
            Analytics.logEvent('new_log');
        }
    }, []);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            dispatch(setUser(mapFirebaseUserToUser(user!)));
            if (user && user.uid) {
                dispatch(fetchLogs(user.uid));
            }
        });
        dispatch(fetchLogs(''));
        return () => unsubscribe();
    }, [fetchLogs, refresh]);

    const handleRefresh = () => setRefresh(prev => !prev);

    const handleLogin = async () => {
        try {
            await dispatch(signInWithGoogle());
            router.push('/logs');
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleLogout = async () => {
        try {
            dispatch(signOut());
            dispatch(setUser(null));
            // Clear the logs state immediately
            dispatch(setLogs([]))
            // Fetch logs from local storage after logout
            const localLogs = dispatch(fetchLogsFromLocal());
            if (logs) {
                dispatch(setLogs((await localLogs).payload));
            }
            router.push('/logs');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className={'fixed top-0 left-0 bottom-0 bg-surface dark:bg-gray-700 overflow-y-auto z-20'}>
            <div className={`flex flex-col h-full transition-width duration-700 ${showSideBar ? 'w-64' : 'w-0'}`}>
                {/* Fixed IconButton */}
                <div className='sticky top-0 z-10 pt-2 pb-2'>
                    <div className='flex justify-end pr-4'>
                        <SearchDialog />
                        <IconButton
                            ariaLabel="New Note"
                            onClick={() => onLogClick(null)}
                        >
                            <PencilSquareIcon className={Constants.styles.iconTheme} />
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
                        {logs.map((log: any) => (
                            <SidebarItem
                                id={log.id!}
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
                    <div className="flex items-center space-x-2">
                        <ShortCutsGuide />
                        <ThemeSwitcher />
                    </div>
                    {/* <Link href="/settings">Settings</Link> */}
                    <LoginMenu onLogOut={handleLogout} onLogin={handleLogin} loading={loading} onSettings={() => {
                        router.push('/settings');
                    }} />
                </div>
            </div>

        </div>
    );
};

export default Sidebar;