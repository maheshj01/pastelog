import PreviewPage from '@/app/(main)/_components/PreviewPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Pastelog",
    description: "PasteLog is a simple, fast, and powerful pastebin. It is powered by firebase in the backend. It allows you to publish your logs, and access them from anywhere and any device via a unique link.",

};

// This is required for dynamic routing in runtime
// export const dynamicParams = true;

// export async function generateStaticParams() {
//     const logService = new LogService();
//     const logs = await logService.fetchLogs();
//     return logs.map(log => ({ id: log.id }));
// }


export default function LogPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <PreviewPage
        logId={id}
    />;
};