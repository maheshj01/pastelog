import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Log from "../_models/Log";
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import IconButton from "./IconButton";
import SidebarItem from './SideBarItem';
import { Theme } from './ThemeSwitcher';

const Sidebar: React.FC = ({ }) => {
    const { id, setSelected, setId, showSideBar, setShowSideBar } = useSidebar();
    const [loading, setLoading] = useState<boolean>(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const router = useRouter();

    function onLogClick(log: Log | null) {
        if (log) {
            setSelected(log);
            setId(log.id!);
            router.push(`/logs/${log.id}`);
        } else {
            setSelected(null);
            setId(null);
            router.push(`/logs`);
        }
    }

    async function fetchLogs() {
        setLoading(true);
        const logService = new LogService();
        const logs = await logService.fetchLogs();
        setLogs(logs);
        logService.deleteExpiredLogs();
        setLoading(false);
    }

    useEffect(() => {
        fetchLogs();
    }, []);
    const { theme } = useTheme();
    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${showSideBar ? 'w-64' : 'w-0'}`}>
                <div className="loader" /> {/* You can replace this with a proper loading spinner */}
            </div>
        );
    }

    return (
        <div
            className={`fixed top-0 left-0 bottom-0 bg-surface overflow-y-auto ${theme == Theme.DARK ? 'darkTheme' : 'lightTheme'}`}>
            <div className={`flex flex-col h-full transition-width duration-1000 ${showSideBar ? 'w-64' : 'w-0'}`}>
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
                        <SidebarItem
                            id={log.id!}
                            selected={id === log.id}
                            log={log}
                            key={log.id}
                            onLogClick={() => onLogClick(log)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;