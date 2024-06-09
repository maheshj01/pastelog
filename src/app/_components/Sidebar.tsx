import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Log from "../_models/Log";
import IconButton from "./IconButton";
import SidebarItem from './SideBarItem';

interface SidebarProps {
    // id of the selected log
    id: string | null;
    logs: Log[];
    loading: boolean;
    onLogClick: (id: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ id, logs, loading, onLogClick }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader" /> {/* You can replace this with a proper loading spinner */}
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
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
                        onLogClick={() => onLogClick(log.id!)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;