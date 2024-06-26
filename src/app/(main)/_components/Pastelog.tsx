"use client";
import { getDateOffsetBy } from "@/utils/utils";
import { Button as PSButton } from "@nextui-org/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Log, { LogType } from "../_models/Log";
import LogService from "../_services/logService";
import { DatePicker } from "./DatePicker";
import Editor from "./Editor";
import PSInput from "./PSInput";
import ShortcutWrapper from "./ShortCutWrapper";
import { Button } from './button';

export default function Pastelog({ id }: { id?: string }) {

    const { theme } = useTheme();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [preview, setPreview] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const today = new Date();
    const [expiryDate, setExpiryDate] = useState<Date>(getDateOffsetBy(30));
    const logService = new LogService();
    const selected = 'dark:bg-gray-600 bg-gray-400 text-slate-50 dark:text-slate-50';
    const unSelected = 'text-black bg-accent dark:text-slate-50 ';
    const router = useRouter();

    async function publish() {
        setLoading(true);
        const log = new Log(
            expiryDate,
            content,
            new Date(),
            LogType.TEXT,
            true,
            title,
            false,
        );
        const id = await logService.publishLog(log);
        // const id = await logService.publishLogWithId(log, 'shortcuts');
        if (!id) {
            setLoading(false);
            return;
        }
        // Push the route and then reload the page
        router.push(`/logs/publish/${id}`);
        setLoading(false);
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
                            className="my-2"
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
                                    onSelect={(date: Date) => setExpiryDate(date!)}
                                    selected={expiryDate}
                                />
                            </div>
                            <div className="w-full max-w-none px-1 prose prose-indigo dark:prose-dark">
                                <Editor
                                    preview={preview}
                                    className={theme != 'dark' ? ` bg-slate-50 text-black` : `bg-gray-700 text-white`}
                                    value={content}
                                    onChange={(e) => { setContent(e.target.value) }}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="flex w-full md:w-3/4 lg:w-2/3 justify-end my-4 px-2">
                            {/* <DatePicker
                                onSelect={(date: Date) => setExpiryDate(date!)}
                                selected={expiryDate}
                            /> */}

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
