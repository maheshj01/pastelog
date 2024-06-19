"use client";
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Log from "../_models/Log";
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import IconButton from "./IconButton";

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
        } else {
            setSelected(null);
            setId(null);
            router.push(`/logs`);
        }
    }, [router, setSelected, setId]);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        const logService = new LogService();
        const logs = await logService.fetchLogsFromLocal();
        setLogs(logs);
        await logService.deleteExpiredLogs();
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs, refresh]);

    const handleRefresh = () => setRefresh(prev => !prev);

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${showSideBar ? 'w-64' : 'w-0'}`}>
                <div className="loader" /> {/* You can replace this with a proper loading spinner */}
            </div>
        );
    }

    return (
        <div className={`fixed top-0 left-0 bottom-0 bg-surface overflow-y-auto`}>
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
                <div className='overflow-y-auto flex-grow pb-16'>
                    {logs.map((log: Log) => (
                        <div key={log.id}
                            onClick={() => onLogClick(log)}
                            className="px-2 w-full mx-2 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white"
                        >

                            {log.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
