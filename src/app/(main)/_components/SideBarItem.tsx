import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useDisclosure } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { Key, useState } from 'react';
import Log from "../_models/Log";
import LogService from '../_services/logService';
import PSDropdown from "./Dropdown";
import ShareDialog from "./Share";

interface SidebarItemProps {
    id: string;
    log: Log;
    selected: boolean;
    onLogClick: (id: Log) => void;
    onRefresh: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ selected, id, log, onLogClick, onRefresh }) => {
    const [isHovered, setIsHovered] = useState(false);
    const pathName = usePathname();
    const { isOpen, onOpen, onClose } = useDisclosure();

    function MoreOptions() {
        const options = ['Share', 'Delete', 'Delete Local'];

        return (<PSDropdown
            options={options}
            onClick={handleonAction}
            className="dropdown-class">
            <EllipsisHorizontalIcon
                className='h-5 w-7 cursor-pointer transition-all duration-100' />
        </PSDropdown>
        );
    }

    const [shareContent, setShareContent] = useState({
        title: "Share Pastelog",
        content: process.env.NEXT_PUBLIC_BASE_URL + '/logs/publish/' + id,
    });

    const handleShare = () => {
        // Copy link to clipboard
        navigator.clipboard.writeText(shareContent.content);
        onClose(); // Close the dialog after sharing
    };


    async function handleonAction(key: Key) {
        const logService = new LogService();
        switch (key) {
            case '1':
                await logService.deleteLogById(id);
                onRefresh();
                break;
            case '2':
                await logService.deleteLogFromLocal(id);
                onRefresh();
                break;
            case '0':
                onOpen();
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
                    <ShareDialog
                        isOpen={isOpen}
                        onClose={onClose}
                        onShare={handleShare}
                        title={shareContent.title}
                        content={shareContent.content}
                    />
                </div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface pointer-events-none"></div>
            </div>
        </div>
    );
};

export default SidebarItem;
