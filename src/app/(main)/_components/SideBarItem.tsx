import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { Key, useState } from 'react';
import Log from "../_models/Log";
import LogService from '../_services/logService';
import PSDropdown from "./Dropdown";

interface SidebarItemProps {
    id: string;
    log: Log;
    selected: boolean;
    onLogClick: (id: Log) => void;
    onRefresh: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ selected, id, log, onLogClick, onRefresh }) => {
    const [isHovered, setIsHovered] = useState(false);

    function MoreOptions() {
        const options = ['Share', 'Delete'];

        return (<PSDropdown
            options={options}
            onClick={handleonAction}
            className="custom-dropdown-class">
            <EllipsisHorizontalIcon
                className='h-5 w-7 cursor-pointer transition-all duration-100' />
        </PSDropdown>
        );
    }

    async function handleonAction(key: Key) {
        const logService = new LogService();
        switch (key) {
            case 'delete':
                await logService.deleteLogFromLocal(id);
                onRefresh();
                break;
            case 'save':
                // do nothing
                break;
            default:
                break;
        }
    }

    return (
        <div
            key={log.id}
            className="px-2 py-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`text-sm dark:text-slate-200 cursor-pointer py-3 hover:bg-background transition-all duration-100 px-2 rounded-md whitespace-nowrap overflow-hidden text-ellipsis relative ${selected ? 'bg-background' : ''}`}
                onClick={() => onLogClick(log)}
            >
                <div className='flex justify-between items-center'>
                    <span>{log.title!.length === 0 ? log.id : log.title}</span>
                    {(selected || isHovered) && <MoreOptions />}
                </div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface pointer-events-none"></div>
            </div>
        </div>
    );
};

export default SidebarItem;
