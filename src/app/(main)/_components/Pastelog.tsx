"use client";
import { showToast } from "@/utils/toast_utils";
import { getDateOffsetBy } from "@/utils/utils";
import { Button as PSButton } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/react";
import { UploadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Log, { LogType } from "../_models/Log";
import Analytics from "../_services/Analytics";
import LogService from "../_services/logService";
import { DatePicker } from "./DatePicker";
import Editor from "./Editor";
import ImportDialog from "./Import";
import PSInput from "./PSInput";
import ShortcutWrapper from "./ShortCutWrapper";
import { Button } from './button';

export default function Pastelog({ id }: { id?: string }) {

    const { theme } = useTheme();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [preview, setPreview] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [expiryDate, setExpiryDate] = useState<Date>(getDateOffsetBy(30));
    const logService = new LogService();
    const selected = 'dark:bg-gray-600 bg-gray-400 text-slate-50 dark:text-slate-50';
    const unSelected = 'text-black bg-accent dark:text-slate-50 ';
    const router = useRouter();
    const [importContent, setImportContent] = useState({
        title: "Import Log",
        content: 'Paste a Pastelog link or a Gist URL to import a log.',
    });

    const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
    const toastId = React.useRef('import-toast');

    const notify = (error: boolean, message: string) => {
        if (!toast.isActive(toastId.current!)) {
            showToast(error ? "error" : "success", <p> {message}</p >,
                {
                    toastId: 'import-toast',
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                    }
                }
            );
        }
    }
    async function publish() {
        setLoading(true);
        const log = new Log(
            expiryDate,
            content,
            new Date(),
            LogType.TEXT,
            true,
            title,
            '',
            false,
        );
        const id = await logService.publishLog(log);
        // const id = await logService.publishLogWithId(log, 'shortcuts');
        if (!id) {
            setLoading(false);
            return;
        }
        router.push(`/logs/publish/${id}`);
        setLoading(false);
        Analytics.logEvent('publish_pastelog', { id: id, action: 'click' });
    }

    async function handleImport(url: string) {
        try {
            if (url.includes('gist.github.com')) {
                const id = url.split('/').pop();
                console.log(id);
                const log = await logService.importLogFromGist(id!);
                if (log) {
                    setTitle(log.title!);
                    setContent(log.data!);
                    notify(false, "Log imported successfully");
                    Analytics.logEvent('import_gist', { id: id, action: 'click' });
                    onImportClose();
                }
            }
            else if (url.includes('pastelog.vercel.app/logs')) {
                const id = url.split('/').pop();
                console.log(id);
                const log = await logService.fetchLogById(id!);
                if (log) {
                    setTitle(log.title!);
                    setContent(log.data!);
                    setExpiryDate(log.expiryDate!);
                    notify(false, "Log imported successfully");
                    onImportClose();
                    Analytics.logEvent('import_pastelog', { id: id, action: 'click' });
                } else {
                    notify(true, "Invalid Pastelog URL");
                }
            } else {
                notify(true, "Please enter a valid URL");
            }
        } catch (e) {
            notify(true, "Please enter a valid URL");
        }
    }

    useEffect(() => {
        if (id) {
            logService.fetchLogById(id).then((log) => {
                if (log) {
                    setTitle(log.title!);
                    setContent(log.data!);
                    setExpiryDate(log.expiryDate!);
                }
            });
        }
    }, [id])


    const togglePreview = React.useCallback(() => {
        setPreview((prev) => !prev);
    }, [])

    return (
        <>
            <ShortcutWrapper onCtrlP={togglePreview}>
                <div className="min-h-screen relative xsm:px-2">
                    <div
                        aria-disabled={loading}
                        className={`flex flex-col items-center sm:px-4 w-full ${loading ? 'pointer-events-none' : ''}`}>
                        <PSInput
                            className="my-2 w-full md:w-3/4 lg:w-2/3"
                            placeHolder="Pastelog Description"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value) }}
                            disabled={loading}
                        />
                        <div className="flex flex-col items-center w-full md:w-3/4 lg:w-2/3 border-black rounded-lg bg-surface">

                            <div className="flex flex-row justify-between items-center pr-2 w-full h-12 mb-1">
                                <div className="flex flex-row justify-start">
                                    <PSButton
                                        className={`rounded-tl-lg rounded-bl-none rounded-r-none ${!preview ? selected : unSelected}`}
                                        size="lg"
                                        onClick={() => setPreview(false)}
                                        disabled={loading}
                                    >Edit</PSButton>
                                    <PSButton
                                        className={`rounded-l-none rounded-tr-lg rounded-br-none ${preview ? selected : unSelected}`}
                                        size="lg"
                                        onClick={() => setPreview(true)}
                                        disabled={loading}
                                    >Preview</PSButton>
                                </div>
                                <DatePicker
                                    onSelect={(date: Date) => {
                                        setExpiryDate(date!);
                                        Analytics.logEvent('set_expiry_date', { date: date, action: 'click' });
                                    }}
                                    selected={expiryDate}
                                />
                            </div>
                            <div className="w-full max-w-none px-1 prose prose-indigo dark:prose-dark">
                                <Editor
                                    preview={preview}
                                    className={theme != 'dark' ? ` bg-slate-50 text-black` : `bg-gray-700 text-white`}
                                    value={content}
                                    isRepublish={id ? true : false}
                                    onChange={(e) => {
                                        setContent(e.target.value)
                                    }}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="flex w-full md:w-3/4 lg:w-2/3 justify-end my-4 px-2">
                            {/* <DatePicker
                                onSelect={(date: Date) => setExpiryDate(date!)}
                                selected={expiryDate}
                            /> */}
                            <div className="flex justify-around items-center border px-4 py-2 w-[164px] cursor-pointer" onClick={onImportOpen}>
                                Import
                                <UploadIcon />
                            </div>
                            <ImportDialog
                                isOpen={isImportOpen}
                                onClose={onImportClose}
                                onImport={handleImport}
                                title={importContent.title}
                                content={importContent.content}
                            />
                            <div className="w-6" />
                            <Button
                                className={`bg-gray-700`}
                                onClick={publish}
                                disabled={loading || !content}
                            >
                                <div className={`px-4 ${loading || !content ? 'text-gray-300' : 'text-primary-foreground'}`}>
                                    {loading ? 'Publishing...' : 'Publish'}
                                </div>
                            </Button>
                        </div>
                        <div
                            className="h-16"
                        />
                        <div className="mb-8 h-32 flex justify-center items-center">
                            <Link color="#2563eb" href='/policies'> Terms of service</Link>
                        </div>
                    </div >
                </div >
            </ShortcutWrapper >
        </>
    );
}
