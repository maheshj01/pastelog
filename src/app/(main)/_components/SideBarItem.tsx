import { showToast } from "@/utils/toast_utils";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useDisclosure } from "@nextui-org/react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import React, { Key, useRef, useState } from "react";
import { toast } from "react-toastify";
import useClickOutside from "../_hooks/outsideclick";
import Log from "../_models/Log";
import Analytics from "../_services/Analytics";
import { useSidebar } from "../_services/Context";
import LogService from '../_services/logService';
import DeleteDialog from "./Delete";
import PSDropdown from "./Dropdown";
import GeminiIcon from "./GeminiIcon";
import ShareDialog from "./Share";
interface SidebarItemProps {
    id: string;
    log: Log;
    selected: boolean;
    onLogClick: (id: Log) => void;
    onRefresh: () => void;
    className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ selected, id, log, onLogClick, onRefresh, className }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { id: selectedId, setId: setSelectedId, user, apiKey } = useSidebar();
    const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [isEditing, setIsEditing] = useState(false);
    const [titleLoading, setTitleLoading] = useState(false);
    const [logTitle, setLogTitle] = useState<string>(log.title || log.id || '');
    const router = useRouter();
    const logService = new LogService();
    const publicLogs = ['getting-started', 'shortcuts'];
    const showMoreOptions = !publicLogs.includes(log.id!);
    function MoreOptions() {
        const options = ['Share', 'Delete', 'Republish', 'Rename'];
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
        content: 'This action cannot be undone. This log will be deleted from your device and will no longer be available.'
    });

    const handlePreview = () => {
        // new tab
        window.open(shareContent.content, '_blank');
        onShareClose(); // Close the dialog after sharing
    };

    const handleOutSideClick = () => {
        setIsEditing(false);
        if (logTitle !== log.title) {
            const updatedLog = { ...log, title: logTitle, toFirestore: () => ({}) };
            logService.updateLogTitle(id, updatedLog);
            log.title = logTitle;
            setIsEditing(false);
        }

    }

    async function handleonAction(key: Key) {
        const logService = new LogService();
        switch (key) {
            case 'Delete':
                // await logService.deleteLogById(id);
                // onRefresh();
                onDeleteOpen();
                Analytics.logEvent('delete_log', { id: id, action: 'click' });
                break;
            case 'Share':
                onShareOpen();
                Analytics.logEvent('share_log', { id: id, action: 'click' });
                break;
            case 'Republish':
                setSelectedId(null);
                router.push(`/logs?id=${id}`);
                Analytics.logEvent('republish_log', { id: id, action: 'click' });
                break;
            case 'Rename':
                setIsEditing(true);
                const title = log.title || log.id || '';
                inputRef.current?.focus();
                // add cursor to the end of the inputs
                inputRef.current?.setSelectionRange(title.length, title.length);
                break;
            default:
                break;
        }
    }

    const onGenerateTitle = async () => {
        try {
            setTitleLoading(true);
            const generatedTitle = await logService.generateTitle(apiKey!, log!)
            setLogTitle(generatedTitle || log.title || log.id || '');
        } catch (error) {
            console.error("Error querying Gemini:", error);
        } finally {
            Analytics.logEvent('gemini_title_rename', { id: log.id });
            setTitleLoading(false);
        }
    };

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
        if (!user) {
            // await logService.deleteLogById(id);
            await logService.deleteLogFromLocal(id);
            notify('Log Deleted Successfully');
        } else {
            await logService.deleteLogById(id);
            // notify('Log deleted from Server Only');
        }
        if (id == selectedId) {
            setSelectedId(null);
            router.push('/logs');
        }
        onRefresh();
    }

    const inputRef = useRef<HTMLInputElement>(null);
    useClickOutside(inputRef, handleOutSideClick);

    if (isEditing) {
        return (
            <div
                ref={inputRef as React.RefObject<HTMLDivElement>}
                key={log.id}
                className={`flex justify-between items-center text-sm dark:text-slate-200 cursor-pointer py-2 transition-all duration-100 px-2 rounded-md whitespace-nowrap overflow-hidden relative bg-background`}>
                <input
                    type="text"
                    value={logTitle}
                    onChange={(e) => setLogTitle(e.target.value)}
                    className="text-black dark:text-white mx-2 py-1 w-full border-none focus:outline-none bg-transparent"
                />
                <GeminiIcon
                    toolTip="Generate Title"
                    onGeminiTrigger={() => {
                        if (!titleLoading) {
                            onGenerateTitle();
                        }
                    }}><Image
                        src={"/images/gemini.png"}
                        alt="Logo"
                        width={32}
                        height={32}
                        className={`cursor-pointer transition-transform duration-500 transform hover:scale-150 h-8 m-0 p-0 ${titleLoading ? 'animate-pulse transform scale-150' : ''}`}
                    /></GeminiIcon>
            </div >
        )
    }

    return (
        <div
            key={log.id}
            className="px-2 py-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`text-sm dark:text-slate-200 cursor-pointer py-3 transition-all duration-100 px-2 rounded-md whitespace-nowrap overflow-hidden relative ${selected ? 'bg-background' : ''} ${className}`}
                onClick={() => onLogClick(log)}
            >
                <div className='flex justify-between items-center'>
                    <div
                        className='flex-grow overflow-hidden'>
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{log.title!.length === 0 ? log.id : log.title}</span>
                        <ShareDialog
                            isOpen={isShareOpen}
                            onClose={onShareClose}
                            onShare={handlePreview}
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
                        {showMoreOptions && (selected || isHovered) && <MoreOptions />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarItem;
