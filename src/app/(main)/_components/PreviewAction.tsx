import { showToast } from '@/utils/toast_utils';
import { downloadImage, downloadText } from '@/utils/utils';
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { useDisclosure } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Key, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Log from '../_models/Log';
import Analytics from '../_services/Analytics';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import PSDropdown from './Dropdown';
import IconButton from './IconButton';
import ShareDialog from './Share';
import { Button } from './button';

interface PreviewActionProps {
    isEditing: boolean,
    previewLog: Log,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    isPublishRoute: boolean,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onAction?: (update: boolean) => void;
    className?: string
}

const PreviewAction: React.FC<PreviewActionProps> = ({ className, loading, setLoading, previewLog, isEditing, setIsEditing, isPublishRoute, onAction }) => {
    const { user } = useSidebar();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const logService = new LogService();
    const logId = previewLog.id;
    const [copied, setCopied] = useState<boolean>(false);
    const pathName = usePathname();

    function More() {
        const options = ['Image', 'Text', 'Share'];
        // if (!isPublishRoute) {
        //     options.push('Share');
        // }
        if (!logService.isLogPresentLocally(logId!)) {
            options.push('Save');
        }
        return (<PSDropdown
            options={options}
            onClick={handleonAction}
            placement='bottom-end'
            className="custom-dropdown-class">
            <EllipsisHorizontalIcon
                className='h-7 w-7 cursor-pointer dark:text-slate-100 transition-all duration-100' />
        </PSDropdown>
        );
    }

    const [shareContent, setShareContent] = useState({
        title: "Share Pastelog",
        content: process.env.NEXT_PUBLIC_BASE_URL + pathName,
    });

    function handleonAction(key: Key) {
        switch (key) {
            case 'Image':
                downloadImage();
                Analytics.logEvent('download_image', { id: logId });
                break;
            case 'Text':
                downloadText(previewLog!);
                Analytics.logEvent('download_text', { id: logId });
                break;
            case 'Share':
                onOpen();
            // case '3':
            //     logService.saveLogToLocal(previewLog!);
            default:
                break;
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/logs/publish/${previewLog?.id}`);
        onClose();
    };

    const toastId = React.useRef('clipboard-toast');
    const notify = () => {
        if (!toast.isActive(toastId.current!)) {
            showToast("success", <p> Copied to Clipboard! </p >,
                {
                    toastId: 'clipboard-toast',
                }
            );
        }
        Analytics.logEvent('copy_clipboard', { id: logId });
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(previewLog?.data as string);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
        notify();
    }

    return (
        <div className={`flex justify-between items-center ${className}`}>

            <div className='flex justify-end space-x-2'>
                <IconButton
                    onClick={handleCopy}
                    ariaLabel="Copy to clipboard"
                >{!copied ?
                    (<ContentCopyIcon />)
                    :
                    (<DoneIcon
                        color='success'
                    />)
                    }
                </IconButton>
                {
                    user && !isPublishRoute && (
                        !isEditing ? (<div className='flex'>
                            <IconButton onClick={() => {
                                setIsEditing(true);
                            }}
                                ariaLabel="Edit">
                                <FaEdit className='size-6 text-black dark:text-white' />
                            </IconButton>
                        </div>
                        ) : (<div className='flex space-x-2'>
                            <Button
                                className='bg-gray-600'
                                onClick={() => {
                                    if (onAction) {
                                        onAction(false);
                                    }
                                }}
                            >
                                <div className={`px-4'text-primary-foreground'}`}>
                                    Cancel
                                </div>
                            </Button>
                            <Button
                                className='bg-primary'
                                onClick={() => {
                                    if (onAction) {
                                        onAction(true);
                                    }
                                }}
                            >
                                Update
                            </Button>
                        </div>
                        ))
                }

                {isPublishRoute && (
                    <div className='space-x-2'>
                        {/* <Button
                                        variant='bordered'
                                        className='border-code-onSurface'
                                        onClick={() => { }}>
                                        {'save'}
                                    </Button> */}
                        <More />
                        <ShareDialog
                            isOpen={isOpen}
                            onClose={onClose}
                            onShare={handleShare}
                            title={shareContent.title}
                            content={shareContent.content}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PreviewAction;