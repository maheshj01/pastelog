"use client";
import Editor from '@/app/_components/Editor';
import PSNavbar from '@/app/_components/PSNavbar';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Log from '../_models/Log';
import LogService from '../_services/logService';


const Preview = (props: { id: string }) => {
    const logService = new LogService();
    const [loading, setLoading] = useState<boolean>(false);
    const [log, setLog] = useState<Log>();

    const { theme } = useTheme();
    const id = props.id;

    async function fetchLogsById() {
        setLoading(true);
        console.log('fetching logs by id:', id);
        const logById = await logService.fetchLogById(id as string);
        if (!logById) {
            setLoading(false);
            console.error('Log not found');
            // router.push('/404');
            return;
        }
        setLog(logById);
        setLoading(false);
    }
    useEffect(() => {
        fetchLogsById()
    }, []);
    return (
        <div>
            <PSNavbar />
            <div className="w-full max-w-none px-1 prose prose-indigo dark:prose-dark">
                <Editor
                    preview={true}
                    className={theme != 'dark' ? ` bg-slate-200 text-black` : `bg-gray-700 text-white`}
                    value={log?.data}
                    disabled={loading}
                />
            </div>
        </div>
    )
}

export default Preview;