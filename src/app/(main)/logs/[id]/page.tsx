import Preview from '@/app/(main)/_components/Preview';
import type { Metadata } from "next";
import LogService from '../../_services/logService';

// This is required for dynamic routing in runtime
export const dynamicParams = true;

export const metadata: Metadata = {
    title: "Pastelog",
    description: "PasteLog is a simple, fast, and powerful pastebin. It is powered by firebase in the backend. It allows you to publish your logs, and access them from anywhere and any device via a unique link.",

};
export async function generateStaticParams() {
    const logService = new LogService();
    const logs = await logService.fetchLogs();
    // const logs = await logService.fetchLogsFromLocal();
    return logs.map(log => ({ id: log.id }));
}


export default function LogPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <Preview
        logId={id}
    />;
};