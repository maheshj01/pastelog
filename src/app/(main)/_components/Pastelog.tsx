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
import { useSidebar } from "../_services/Context";
import LogService from "../_services/logService";
import { DatePicker } from "./DatePicker";
import Editor from "./Editor";
import ImportDialog from "./Import";
import PSInput from "./PSInput";
import ShortcutWrapper from "./ShortCutWrapper";
import { Button } from "./button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./select";

export default function Pastelog({ id }: { id?: string }) {

    const { theme, setTheme } = useTheme();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [preview, setPreview] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [importLoading, setImportLoading] = useState<boolean>(false);
    const [expiryDate, setExpiryDate] = useState<Date | null>(getDateOffsetBy(30));
    const logService = new LogService();
    const selected = 'dark:bg-gray-600 bg-gray-400 text-slate-50 dark:text-slate-50';
    const unSelected = 'text-black bg-accent dark:text-slate-50 ';
    const router = useRouter();
    const [editorKey, setEditorKey] = useState<number>(0);
    const expiryDays = ["7 days", "30 days", "90 days", "6 months", "1 year"];
    const expiryValuesInDays = [7, 30, 90, 180, 365, 9999];
    const [selectExpiry, setSelectExpiry] = useState<string>(expiryDays[1]);
    const [importContent, setImportContent] = useState({
        title: "Import Log",
        content: 'Paste a Pastelog link or a Gist URL to import a log.',
    });

    const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();
    const toastId = React.useRef('import-toast');
    const { setShowSideBar, showSideBar, toggleSideBar, user } = useSidebar();
    if (user) {
        expiryDays.push("Never");
    }
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


    function SelectExpiryComp() {
        return (
            <Select value={selectExpiry} onValueChange={(x) => {
                setSelectExpiry(x);
                var date: Date = new Date();
                if (x === "Never") {
                    // date = new Date('9999-12-31');
                    setExpiryDate(null)
                    return;
                } else {
                    const index = expiryDays.indexOf(x);
                    const daysOffset = expiryValuesInDays[index];
                    date = getDateOffsetBy(daysOffset);
                }
                onDateSelect(date);
            }}>
                <SelectTrigger className="px-2 focus: border-none">
                    <SelectValue placeholder="Expiry Date" />
                </SelectTrigger>
                <SelectContent className="bg-background" >
                    <SelectGroup>
                        {/* <SelectLabel>Custom</SelectLabel> */}
                        {
                            expiryDays.map((day, index) => {
                                return (
                                    <SelectItem
                                        key={`${day}-${index}`} value={day}>{day}</SelectItem>
                                )
                            })
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        )
    }

    async function publish() {
        try {

            setLoading(true);
            const log = new Log({
                expiryDate: expiryDate,
                data: content,
                type: LogType.TEXT,
                title: title,
                createdDate: new Date(),
                isExpired: false,
                summary: '',
                isPublic: false,
                userId: user ? user.uid : null,
                isMarkDown: true,
            }
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
        } catch (e) {
            notify(true, "Failed to publish log");
            setLoading(false);
        }
    }



    async function handleImport(url: string) {
        setImportLoading(true);
        try {
            if (url.includes('gist.github.com')) {
                const id = url.split('/').pop();
                const log = await logService.importLogFromGist(id!);
                if (log) {
                    setTitle(log.title!);
                    setContent(log.data!);
                    // Here content value is blank but log.data is not blank
                    setEditorKey(prevKey => prevKey + 1);
                    if (log.data) {
                        notify(false, "Log imported successfully");
                        Analytics.logEvent('import_gist', { id: id, action: 'click' });
                    }
                    onImportClose();
                }
            }
            else if (url.includes('pastelog.vercel.app/logs')) {
                const id = url.split('/').pop();
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
        setImportLoading(false);
    }

    function onDateSelect(date: Date) {
        setExpiryDate(date!);
        Analytics.logEvent('set_expiry_date', { date: date, action: 'click' });
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

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <ShortcutWrapper onCtrlShiftP={togglePreview} onCtrlShiftD={toggleTheme} onCtrlShiftN={() => {
                router.push('/logs');
            }}>
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
                                <div className='flex justify-end items-center space-x-1'>
                                    <div className="flex items-center space-x-1">
                                        <p className="text-sm hidden md:block">{expiryDate ? "Expires in" : "Expires"}</p>
                                        <div className="hidden md:block"><SelectExpiryComp /></div>
                                    </div>
                                    {expiryDate && <DatePicker
                                        onSelect={onDateSelect}
                                        selected={expiryDate!}
                                    />}
                                </div>
                            </div>
                            <div className="w-full max-w-none px-1 prose prose-indigo dark:prose-dark">
                                <Editor
                                    key={editorKey}
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
                                importLoading={importLoading}
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
                        <div className="h-16" />
                        <div className="mb-8 h-32 flex justify-center items-center">
                            <Link color="#2563eb" href='/policies'> Terms of service</Link>
                        </div>
                    </div >
                </div >
            </ShortcutWrapper >
        </>
    );
}
