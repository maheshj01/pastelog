import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Log from "../_models/Log";
import IconButton from "./IconButton";

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
                    <div key={log.id} className="px-2 py-1">
                        <div
                            className={`text-sm dark:text-slate-200 cursor-pointer py-2 hover:bg-background transition-all duration-100 px-2 rounded-md whitespace-nowrap overflow-hidden text-ellipsis relative ${id == log.id ? 'bg-background' : ''}`}
                            onClick={() => onLogClick(log.id!)}
                        >
                            <span>{log.title.length === 0 ? log.id : log.title}</span>
                            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface pointer-events-none"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;