"use client";
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
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
            Analytics.logEvent('change_log', { id: log.id });
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

    const handleRefresh = () => setRefresh(prev => !prev);
    return (
        <div className={`fixed top-0 left-0 bottom-0 bg-surface dark:bg-gray-700 overflow-y-auto`}>
            <div className='absolute bottom-5 left-6'>
                {/* github link */}

                {/* <Link href={process.env.NEXT_PUBLIC_GITHUB_REPO ?? ''} passHref={true}
                    target='_blank'
                > */}
                <IconButton
                    ariaLabel='Github'
                    onClick={() => {
                        window.open(process.env.NEXT_PUBLIC_GITHUB_REPO ?? '', '_blank');
                    }}
                >
                    <Image
                        width={32}
                        height={32}
                        src={process.env.NEXT_PUBLIC_GITHUB_LOGO ?? ''} alt={'Github repo'} />
                </IconButton>
                {/* </Link> */}
            </div>
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
                <div className='overflow-y-auto flex-grow pb-4 mb-16'>
                    {logs.map((log: Log) => (
                        <SidebarItem
                            id={log.id!}
                            selected={id === log.id}
                            log={log}
                            key={log.id}
                            onLogClick={() => onLogClick(log)}
                            onRefresh={handleRefresh} // Pass the refresh function
                        />
                    ))}
                </div>
            </div>)}
        </div>
    );
};

export default Sidebar;
