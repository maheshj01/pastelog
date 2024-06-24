
import Preview from '@/app/(main)/_components/Preview';
import LogService from '@/app/(main)/_services/logService';
import { Metadata } from 'next';

// This is required for dynamic routing in runtime
export const dynamicParams = true;

export const metadata: Metadata = {
    title: "Pastelog",
    description: "Create Stunning Rich Text Logs/Notes with markdown Support and Code Highlighting and share it with the world.",

};
// export async function generateStaticParams() {
//     const logService = new LogService();
//     const logs = await logService.fetchLogs();
//     return logs.map(log => ({ id: log.id }));
// }

export default function PublishPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <Preview
        logId={id}
    />
};