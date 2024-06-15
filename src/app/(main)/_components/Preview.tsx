"use client";
import Editor from '@/app/(main)/_components/Editor';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import html2canvas from 'html2canvas';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Key, useEffect, useState } from 'react';
import Log from '../_models/Log';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import IconButton from './IconButton';

const Preview = ({ logId }: { logId: string }) => {
    const logService = new LogService();
    const [loading, setLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);
    const [previewLog, setpreviewLog] = useState<Log | null>(null);
    const { theme } = useTheme();
    const { showSideBar } = useSidebar();

    const router = useRouter();


    function Download() {
        return (
            <Dropdown
                size='md'
                className='min-w-32 w-fit'
                placement='bottom-start' >
                <DropdownTrigger>
                    <Button
                        variant='bordered'
                        className='border-code-onSurface'>
                        {'download'}
                    </Button>

                </DropdownTrigger>
                <DropdownMenu
                    aria-label="download"
                    // disabledKeys={["edit", "delete"]}
                    onAction={handleonAction}
                >
                    <DropdownItem key="image">Image</DropdownItem>
                    <DropdownItem key="text">Text</DropdownItem>
                    {/* <DropdownItem key="delete" className="text-danger" color="danger">
                        Delete file
                    </DropdownItem> */}
                </DropdownMenu>
            </Dropdown>
        );
    }


    function handleonAction(key: Key) {
        switch (key) {
            case 'image':
                downloadImage();
                break;
            case 'text':
                downloadText();
                break;
            default:
                break;
        }
    }

    const downloadText = () => {
        if (!previewLog?.data) return;
        const element = document.createElement("a");
        const file = new Blob([previewLog.data], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "pastelog.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    async function fetchLogsById() {
        setLoading(true);
        const log = await logService.fetchLogById(logId);
        if (!log) {
            setLoading(false);
            // handle not found case, maybe show an error message
            return;
        }
        setpreviewLog(log);
        setLoading(false);
    }
    const downloadImage = async () => {
        const preview = document.getElementById('preview');
        if (!preview) return;

        // Ensure all images within the preview element are fully loaded
        const images = Array.from(preview.getElementsByTagName('img'));
        await Promise.all(images.map(img => new Promise<void>((resolve, reject) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
                img.onerror = () => reject();
            }
            // Set crossOrigin attribute if needed
            if (!img.crossOrigin) {
                img.crossOrigin = 'anonymous';
            }
        })));

        // Capture the canvas and download the image
        html2canvas(preview, { useCORS: true }).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'pastelog.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => {
            console.error('Error capturing the canvas:', error);
        });
    };
    useEffect(() => {
        if (logId) {
            fetchLogsById();
        }
    }, [logId]);
    return (
        <div className={`flex flex-col items-center h-fit`}>
            <div className="w-full md:w-3/4 lg:w-2/3 max-w-none px-1 prose prose-indigo dark:prose-dark">
                <div className='flex flex-col'>
                    <p className="text-black dark:text-slate-50 my-1">{previewLog?.title}</p>

                    {(
                        !loading &&
                        <div className='flex flex-row justify-between'>
                            {
                                previewLog?.expiryDate ?
                                    <div>
                                        <p className="text-black dark:text-slate-50 my-1 font-bold">
                                            {`Expires`}
                                        </p>
                                        <p className="text-black dark:text-slate-50 my-1"> {` ${previewLog?.expiryDate?.toDateString()}`}</p>
                                    </div>
                                    : <div></div>

                            }
                            <Download />
                        </div>
                    )
                    }
                    <div className="relative">
                        <IconButton
                            className='absolute top-2 right-2 '
                            onClick={() => {
                                navigator.clipboard.writeText(previewLog?.data as string);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                            ariaLabel="Copy to clipboard"
                        >{!copied ?
                            (<ContentCopyIcon />)
                            :
                            (<DoneIcon
                                color='success'
                            />)
                            }
                        </IconButton>
                        <Editor
                            preview={true}
                            className={`bg-background ${theme !== 'dark' ? ` min-h-screen` : `text-white min-h-screen`}`}
                            value={previewLog?.data}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Preview;