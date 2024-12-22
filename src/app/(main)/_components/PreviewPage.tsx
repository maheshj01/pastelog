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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './accordion';

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
    const publicLogs = ['getting-started', 'shortcuts'];
    const showMoreOptions = !publicLogs.includes(logId!);
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

    function SummaryComponent() {
        return <div className='rounded-xl bg-gradient-to-tr'>
            {/* <p className="text-white mb-2 font-bold text-lg">
                Summary
            </p> */}
            {summaryLoading ? (
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            ) : previewLog?.summary ? (
                <div className="bg-white bg-opacity-10 rounded-lg px-2">
                    <MDPreview
                        className='text-black dark:text-white reveal-top-animation'
                        value={previewLog?.summary}
                    />
                </div>
            ) : (
                <p className="italic text-black dark:text-white">No summary available. Tap the Gemini Icon to generate the Summary</p>
            )}
        </div>
    }

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
            editedLog!.lastUpdatedAt = new Date().toUTCString();
            await logService.updateLog(logId, editedLog!);
            setpreviewLog(new Log({ ...editedLog! }));
        } else {
            seteditedLog(new Log({ ...previewLog! }));
        }
        setIsEditing(false);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    if (previewLog === null || (previewLog.expiryDate != null && new Date(previewLog.expiryDate) < new Date())) {
        const className = 'text-md text-black dark:text-slate-50 my-1';
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className={`text-3xl`}>{"This Note has Expired"}</p>
                    <p className={className}>{"or it has been deleted by the owner"}</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`flex flex-col items-center h-fit`}>
            <div className="w-full md:w-3/4 lg:w-2/3 max-w-none px-1 prose prose-indigo dark:prose-dark">
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        <div className='grow'>
                            <div className='flex justify-between items-center gap-10'>
                                <p className="text-3xl font-medium text-black dark:text-slate-50 my-1">
                                    {previewLog?.title}</p>
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
                            {!loading && <div>
                                <Accordion
                                    type="single" collapsible>
                                    <AccordionItem value="details">
                                        <AccordionTrigger className='dark:text-white p-0'>Details</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                <p className='m-0'>
                                                    <span className="font-medium">Created At:</span>{" "}
                                                    {formatReadableDate(previewLog?.createdDate!)}
                                                </p>
                                                <p className='m-0'>
                                                    <span className="font-medium">Last Updated:</span>{" "}
                                                    {isEditing
                                                        ? formatReadableDate(editedLog?.lastUpdatedAt!)
                                                        : formatReadableDate(previewLog?.lastUpdatedAt!)}
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>}
                        </div>
                    </div>
                    {(previewLog?.summary || summaryLoading) &&
                        <Accordion
                            className='flex-grow'
                            type="single" collapsible>
                            <AccordionItem value="summary">
                                <AccordionTrigger className='dark:text-white p-0'>Summary</AccordionTrigger>
                                <AccordionContent>
                                    <SummaryComponent />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    }
                    {(
                        !loading &&
                        <div className='flex flex-row justify-between items-center pt-2'>
                            {
                                (!isEditing) ? (previewLog?.expiryDate &&
                                    <div>
                                        <p className="text-black dark:text-slate-50 my-1 font-bold">
                                            {`Expires`}
                                        </p>
                                        <p className="text-black dark:text-slate-50 my-1"> {` ${formatReadableDate(previewLog?.expiryDate)}`}</p>
                                    </div>
                                    // : <div>
                                    //     <p className="text-black dark:text-slate-50 my-1 font-bold">
                                    //         {`Expires`}
                                    //     </p>
                                    //     <p className="text-black dark:text-slate-50 my-1"> {`Never`}</p>
                                    // </div>
                                ) : (
                                    <DatePicker
                                        onSelect={(date: Date) => {
                                            seteditedLog(prevLog => new Log({
                                                ...prevLog!,
                                                expiryDate: date.toISOString()
                                            }));
                                            Analytics.logEvent('set_expiry_date', { date: date, action: 'click' });
                                        }}
                                        selected={new Date(editedLog?.expiryDate!)}
                                    />
                                )

                            }
                            <div className='flex w-auto' />
                            {(showMoreOptions && <PreviewAction
                                loading={loading}
                                onAction={handleOnEdit}
                                setLoading={setLoading}
                                previewLog={isEditing ? editedLog! : previewLog!}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                isPublishRoute={isPublishRoute}
                            />
                            )}
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
        </div>
    );
}

export default PreviewPage;

