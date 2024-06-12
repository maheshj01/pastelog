"use client";
import Editor from '@/app/_components/Editor';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Log from '../_models/Log';
import { useSidebar } from '../_services/Context';
import LogService from '../_services/logService';
import IconButton from './IconButton';
import PSNavbar from './PSNavbar';

const Preview = ({ showNavbar, logId }: { showNavbar: boolean, logId: string }) => {
    const logService = new LogService();
    const [loading, setLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);
    const [previewLog, setpreviewLog] = useState<Log | null>(null);
    const { theme } = useTheme();
    const { showSideBar } = useSidebar();

    const router = useRouter();

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

    useEffect(() => {
        if (logId) {
            fetchLogsById();
        }
    }, [logId]);
    return (
        <div className={`flex flex-col items-center h-fit ${showSideBar ? 'pl-64' : 'pl-0'}`}>
            {(showNavbar && <PSNavbar
                sideBarIcon={!showSideBar}
            />)}
            <div className="w-full md:w-3/4 lg:w-2/3 max-w-none px-1 prose prose-indigo dark:prose-dark">
                <div className='flex flex-col'>
                    <p className="text-black dark:text-slate-50 my-1">{previewLog?.title}</p>
                    <div className='flex flex-row'>
                        <p className="text-black dark:text-slate-50 my-1 font-bold">
                            {`Expires: `}
                        </p>
                        <p className="text-black dark:text-slate-50 my-1"> {` ${previewLog?.expiryDate?.toDateString()}`}</p>
                    </div>
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
                            className={`${theme !== 'dark' ? ` bg-slate-200 text-black min-h-screen` : `bg-gray-700 text-white min-h-screen`}`}
                            value={previewLog?.data}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Preview;