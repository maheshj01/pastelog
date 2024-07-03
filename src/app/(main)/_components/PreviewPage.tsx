"use client";
import Editor from '@/app/(main)/_components/Editor';
import { showToast } from '@/utils/toast_utils';
import { formatReadableDate } from '@/utils/utils';
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { useDisclosure } from '@nextui-org/react';
import html2canvas from 'html2canvas';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { Key, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Log from '../_models/Log';
import Analytics from '../_services/Analytics';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import PSDropdown from './Dropdown';
import GeminiDialog from './Gemini';
import IconButton from './IconButton';
import MDPreview from './MDPreview';
import ShareDialog from './Share';

const PreviewPage = ({ logId }: { logId: string }) => {
    const logService = new LogService();
    const { setId, apiKey, setApiKey } = useSidebar();

    const [loading, setLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);
    const [previewLog, setpreviewLog] = useState<Log | null>(null);
    const { theme } = useTheme();
    const pathName = usePathname();
    const isPublishRoute = pathName.includes('/logs/publish');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: geminiOpen, onOpen: onGeminiOpen, onClose: onGeminiClose } = useDisclosure();
    const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
    // const [summaryContent, setSummaryContent] = useState<string>('');

    const [shareContent, setShareContent] = useState({
        title: "Share Pastelog",
        content: process.env.NEXT_PUBLIC_BASE_URL + pathName,
    });
    const [geminiContent, setGeminiContent] = useState({
        title: "Gemini",
        content: 'With the power of Gemini, you can summarize the content of the log. Enter your API key to get started.',
    });

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/logs/publish/${previewLog?.id}`);
        onClose();
    };

    const onSummarizeClicked = async () => {
        try {
            setSummaryLoading(true);
            const summary = await logService.getSummary(apiKey!, previewLog!)
            previewLog!.summary = summary!;
            logService.saveLogToLocal(previewLog!);
        } catch (error) {
            console.error("Error querying Gemini:", error);
        } finally {
            setSummaryLoading(false);
        }
    };

    const onGeminiApiSave = (key: string) => {
        if (key) {
            setApiKey(key);
        }
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

    function More() {
        const options = ['Image', 'Text', 'Share'];
        // if (!isPublishRoute) {
        //     options.push('Share');
        // }
        if (!logService.isLogPresentLocally(logId)) {
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


    function handleonAction(key: Key) {
        switch (key) {
            case '0':
                downloadImage();
                Analytics.logEvent('download_image', { id: logId });

                break;
            case '1':
                downloadText();
                Analytics.logEvent('download_text', { id: logId });
                break;
            case '2':
                onOpen();
            case '3':
                logService.saveLogToLocal(previewLog!);
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
        });
    };
    useEffect(() => {
        if (logId) {
            setId(logId);
            fetchLogsById();
        }
    }, [logId]);
    return (
        <div className={`flex flex-col items-center h-fit`}>
            <div className="w-full md:w-3/4 lg:w-2/3 max-w-none px-1 prose prose-indigo dark:prose-dark">
                <div className='flex flex-col'>
                    <div className='flex items-center py-2'>
                        <div className='grow'>
                            <p className="text-black dark:text-slate-50 my-1">{previewLog?.title}</p>
                        </div>
                        <Image
                            src={"/images/gemini.png"}
                            alt="Logo"
                            width={32}
                            height={32}
                            onClick={() => {
                                if (summaryLoading) {
                                    return;
                                }
                                if (apiKey === undefined || apiKey === null || apiKey === '') {
                                    onGeminiOpen();
                                    Analytics.logEvent('gemini_open', { id: logId });
                                } else {
                                    onSummarizeClicked();
                                }
                            }}
                            className={`cursor-pointer transition-transform duration-500 transform hover:scale-150 h-8 m-0 p-0 ${summaryLoading ? 'animate-pulse transform scale-150' : ''}`}
                        />
                        <GeminiDialog
                            isOpen={geminiOpen}
                            onClose={onGeminiClose}
                            onSave={onGeminiApiSave}
                            title={geminiContent.title}
                            content={geminiContent.content}
                        />
                    </div>
                    <div className='rounded-xl px-4 py-3 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500'>
                        <p className="text-white mb-2 font-bold text-lg">
                            Summary
                        </p>
                        {summaryLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        ) : previewLog?.summary ? (
                            <div className="bg-white bg-opacity-10 rounded-lg p-3">
                                <MDPreview
                                    className='text-white'
                                    value={previewLog?.summary}
                                />
                            </div>
                        ) : (
                            <p className="text-white italic">No summary available. Tap the Gemini Icon to generate the Summary</p>
                        )}
                    </div>
                    {(
                        !loading &&
                        <div className='flex flex-row justify-between'>
                            {
                                previewLog?.expiryDate ?
                                    <div>
                                        <p className="text-black dark:text-slate-50 my-1 font-bold">
                                            {`Expires`}
                                        </p>
                                        <p className="text-black dark:text-slate-50 my-1"> {` ${formatReadableDate(previewLog?.expiryDate)}`}</p>
                                    </div>
                                    : <div></div>

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
                                notify();
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
            </div >
        </div >
    );
}

export default PreviewPage;