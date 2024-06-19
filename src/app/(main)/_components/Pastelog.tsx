"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Log, { LogType } from "../_models/Log";
import { useSidebar } from "../_services/Context";
import LogService from "../_services/logService";

export default function MainContent({ className }: { className?: string }) {
    const { showSideBar, setShowSideBar } = useSidebar();
    const [loading, setLoading] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');
    const logService = new LogService();
    const router = useRouter();
    async function publish() {
        setLoading(true);
        const log = new Log(
            new Date(),
            content,
            new Date(),
            LogType.TEXT,
            true,
            "hello world",
            false,
        );
        const id = await logService.publishLog(log);
        if (!id) {
            setLoading(false);
            return;
        }
        // Push the route and then reload the page
        router.push(`/logs/publish/${id}`);
        setLoading(false);
    }
    return (
        <div className={`${className} transition-all duration-300 ${showSideBar ? 'pl-64' : 'pl-0'}`}>
            <div className={`flex flex-col min-h-screen`}>
                <div className={`flex justify-center items-center h-screen `}>
                    <div className="flex flex-col space-y-2">
                        <div>
                            <textarea className=" w-96"
                                onChange={(e) => { setContent(e.target.value) }}
                                value={content}
                            >

                            </textarea>
                        </div>
                        <button
                            onClick={publish}
                            className="px-2 bg-gray-500">
                            {loading ? 'publishing' : 'publish'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
