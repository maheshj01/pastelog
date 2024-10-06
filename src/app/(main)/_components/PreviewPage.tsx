"use client";
import Editor from '@/app/(main)/_components/Editor';
import { formatReadableDate } from '@/utils/utils';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSidebar } from "../_hooks/useSidebar";
import Log from '../_models/Log';
import Analytics from '../_services/Analytics';
import LogService from '../_services/logService';
import { DatePicker } from "./DatePicker";
import GeminiIcon from './GeminiIcon';
import MDPreview from './MDPreview';
import PreviewAction from './PreviewAction';

const PreviewPage = ({ logId }: { logId: string }) => {
    const logService = new LogService();
    const { setId, apiKey, user } = useSidebar();
    const [loading, setLoading] = useState<boolean>(true);
    const [previewLog, setpreviewLog] = useState<Log | null>(null);
    const [editedLog, seteditedLog] = useState<Log | null>(null);
    const { theme } = useTheme();
    const pathName = usePathname();
    const isPublishRoute = pathName.includes('/logs/publish');
    const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const onSummarizeClicked = async () => {
        try {
            setSummaryLoading(true);
            const summary = await logService.getSummary(apiKey!, previewLog!)
            previewLog!.summary = summary!;
            logService.saveLogToLocal(previewLog!);
        } catch (error) {
            console.error("Error querying Gemini:", error);
        } finally {
            Analytics.logEvent('gemini_open', { id: logId });
            setSummaryLoading(false);
        }
    };

    async function fetchLogsById() {
        setLoading(true);
        const log = await logService.fetchLogById(logId);
        if (!log) {
            setLoading(false);
            // handle not found case, maybe show an error message
            return;
        }
        setpreviewLog(new Log({ ...log }));
        seteditedLog(new Log({ ...log }));
        setLoading(false);
    }
    useEffect(() => {
        if (logId) {
            setId(logId);
            fetchLogsById();

        }
    }, [logId]);

    const handleOnEdit = async (hasUpdated: boolean) => {
        setLoading(true);
        if (hasUpdated) {
            await logService.updateLog(logId, editedLog!);
            setpreviewLog(new Log({ ...editedLog! }));
        } else {
            seteditedLog(new Log({ ...previewLog! }));
        }
        setIsEditing(false);
        setLoading(false);
    }

    return (
        <div className={`flex flex-col items-center h-fit`}>
            <div className="w-full md:w-3/4 lg:w-2/3 max-w-none px-1 prose prose-indigo dark:prose-dark">
                <div className='flex flex-col'>
                    <div className='flex items-center py-2'>
                        <div className='grow'>
                            <p className="text-black dark:text-slate-50 my-1">{previewLog?.title}</p>
                        </div>
                        <GeminiIcon onGeminiTrigger={() => {
                            if (!summaryLoading) {
                                onSummarizeClicked();
                            }
                        }}>
                            <Image
                                src={"/images/gemini.png"}
                                alt="Logo"
                                width={32}
                                height={32}
                                className={`cursor-pointer transition-transform duration-500 transform hover:scale-150 h-8 m-0 p-0 ${summaryLoading ? 'animate-pulse transform scale-150' : ''}`}
                            />
                        </GeminiIcon>
                    </div>
                    {((previewLog?.summary || summaryLoading) && <div className='rounded-xl px-4 py-3 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500'>
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
                    </div>)}
                    {(
                        !loading &&
                        <div className='flex flex-row justify-between items-center'>
                            {
                                (!isEditing) ? (previewLog?.expiryDate ?
                                    <div>
                                        <p className="text-black dark:text-slate-50 my-1 font-bold">
                                            {`Expires`}
                                        </p>
                                        <p className="text-black dark:text-slate-50 my-1"> {` ${formatReadableDate(previewLog?.expiryDate)}`}</p>
                                    </div>
                                    : <div>
                                        <p className="text-black dark:text-slate-50 my-1 font-bold">
                                            {`Expires`}
                                        </p>
                                        <p className="text-black dark:text-slate-50 my-1"> {`Never`}</p>
                                    </div>
                                ) : (
                                    <DatePicker
                                        onSelect={(date: Date) => {
                                            seteditedLog(prevLog => new Log({
                                                ...prevLog!,
                                                expiryDate: date
                                            }));
                                            Analytics.logEvent('set_expiry_date', { date: date, action: 'click' });
                                        }}
                                        selected={editedLog?.expiryDate!}
                                    />
                                )

                            }
                            <PreviewAction
                                className='py-2'
                                loading={loading}
                                onAction={handleOnEdit}
                                setLoading={setLoading}
                                previewLog={isEditing ? editedLog! : previewLog!}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                isPublishRoute={isPublishRoute}
                            />
                        </div>
                    )
                    }
                    <Editor
                        preview={isEditing ? false : true}
                        className={`bg-background ${theme !== 'dark' ? ` min-h-screen` : `text-white min-h-screen mt-2`}`}
                        value={isEditing ? editedLog!.data : previewLog?.data}
                        onChange={(e) => {
                            if (isEditing) {
                                seteditedLog(prevLog => new Log({
                                    ...prevLog!,
                                    data: e.target.value
                                }));
                            }
                        }}
                        disabled={loading || !isEditing}
                    />
                </div>
            </div >
        </div >
    );
}

export default PreviewPage;