"use client";
import { getDateOffsetBy, parsedDate } from "@/utils/utils";
import { Button as PSButton } from "@nextui-org/button";
import { CalendarDate, DatePicker } from "@nextui-org/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Log, { LogType } from "../_models/Log";
import LogService from "../_services/logService";
import Editor from "./Editor";
import PSInput from "./PSInput";
import ShortcutWrapper from "./ShortCutWrapper";
import { Button } from './button';
export default function Pastelog() {

    const { theme } = useTheme();
    const [description, setDescription] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [preview, setPreview] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const today = new Date();
    const [expiryDate, setExpiryDate] = useState<CalendarDate>(getDateOffsetBy(30));
    const logService = new LogService();
    const selected = 'bg-secondary text-slate-50 dark:text-slate-50';
    const unSelected = 'text-black bg-accent dark:text-slate-50 ';
    const router = useRouter();

    async function publish() {
        setLoading(true);
        // 30 days from now
        const today = new Date();
        // Publish the pastelog
        const log = new Log(
            expiryDate.toDate('UTC'),
            content,
            new Date(),
            description,
            LogType.TEXT,
            true
        );
        const id = await logService.publishLog(log);
        if (!id) {
            setLoading(false);
            return;
        }
        router.push(`/logs/publish/${id}`);
        setLoading(false);
    }

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
                            value={description}
                            onChange={(e) => { setDescription(e.target.value) }}
                            disabled={loading}
                        />
                        <div className="flex flex-col items-center w-full md:w-3/4 lg:w-2/3 border-black rounded-lg bg-surface">
                            <div className="flex flex-row justify-start w-full h-12 mb-1">
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
                        {
                            !preview && (
                                <div className="flex w-full md:w-3/4 lg:w-2/3 justify-end my-4 px-2">
                                    <DatePicker
                                        inputMode="none"
                                        onChange={(date) => setExpiryDate(date)}
                                        value={expiryDate}
                                        maxValue={getDateOffsetBy(365)}
                                        minValue={parsedDate(today)}
                                        defaultValue={expiryDate}
                                        description="Expiry date of the pastelog"
                                        variant="bordered"
                                        size="sm"
                                        color="primary"
                                        label="Expiry date"
                                        className="max-w-[164px]" />
                                    <div className="w-6" />
                                    <Button
                                        className={`bg-gradient-to-r from-gray-700 to-gray-800`}
                                        onClick={publish}
                                        disabled={loading || !content}
                                    >
                                        <div className={`px-4 ${loading || !content ? 'text-gray-300' : 'text-white'}`}>
                                            {loading ? 'Publishing...' : 'Publish'}
                                        </div>
                                    </Button>
                                </div>
                            )}
                        <div
                            className="h-16"
                        />
                        <div className="mb-8 h-32 flex justify-center items-center">
                            <Link color="#2563eb" href='/policies'> Terms of service</Link>
                        </div>
                    </div >
                </div >
            </ShortcutWrapper>
        </>
    );
}
