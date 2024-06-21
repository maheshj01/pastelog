import { showToast } from "@/utils/toast_utils";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { Key, useState } from "react";
import { toast } from "react-toastify";
import Log from "../_models/Log";
import { useSidebar } from "../_services/Context";
import LogService from '../_services/logService';
import DeleteDialog from "./Delete";
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
    const { id: selectedId, setId: setSelectedId } = useSidebar();
    const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const router = useRouter();
    function MoreOptions() {
        const options = ['Share', 'Delete'];

        return (<PSDropdown
            options={options}
            placement="bottom-start"
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
    const [deleteContent, setDeleteContent] = useState({
        title: "Are you sure you want to Delete?",
        content: 'By deleting this log, you will lose access to it.'
    });

    const handleShare = () => {
        // Copy link to clipboard
        navigator.clipboard.writeText(shareContent.content);
        onShareClose(); // Close the dialog after sharing
    };

    async function handleonAction(key: Key) {
        const logService = new LogService();
        switch (key) {
            case '1':
                // await logService.deleteLogById(id);
                // onRefresh();
                onDeleteOpen();
                break;
            case '0':
                onShareOpen();
                break;
            default:
                break;
        }
    }

    const toastId = React.useRef('delete-toast');
    const notify = (message: string) => {
        if (!toast.isActive(toastId.current!)) {
            showToast("success", <p> {message} </p >,
                {
                    toastId: 'delete-toast',
                }
            );
        }
    }
    async function handleDelete(local: boolean) {
        const logService = new LogService();
        if (local) {
            await logService.deleteLogById(id);
            await logService.deleteLogFromLocal(id);
            notify('Log Deleted Successfully');
        } else {
            await logService.deleteLogById(id);
            notify('Log deleted from Server Only');
        }
        if (id == selectedId) {
            setSelectedId(null);
            router.push('/logs');
        }
        onRefresh();
    }

    return (
        <div
            key={log.id}
            className="px-2 py-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`text-sm dark:text-slate-200 cursor-pointer py-3 hover:bg-background transition-all duration-100 px-2 rounded-md whitespace-nowrap overflow-hidden relative ${selected ? 'bg-background' : ''}`}
            >
                <div className='flex justify-between items-center'>
                    <div onClick={() => onLogClick(log)}
                        className='flex-grow overflow-hidden'>
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{log.title!.length === 0 ? log.id : log.title}</span>
                        <ShareDialog
                            isOpen={isShareOpen}
                            onClose={onShareClose}
                            onShare={handleShare}
                            title={shareContent.title}
                            content={shareContent.content}
                        />
                        <DeleteDialog
                            isOpen={isDeleteOpen}
                            onClose={onDeleteClose}
                            onDelete={handleDelete}
                            title={deleteContent.title}
                            content={deleteContent.content}
                        />
                    </div>
                    <div className='flex-shrink-0 ml-2'>
                        {(selected || isHovered) && <MoreOptions />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarItem;
