import Preview from '@/app/(main)/_components/Preview';
import LogService from '@/app/(main)/_services/logService';

// This is required for dynamic routing in runtime
export const dynamicParams = true;

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