import Preview from '@/app/_components/Preview';
import LogService from '../../_services/logService';

// export const dynamicParams = true;

export async function generateStaticParams() {
    const logService = new LogService();
    const logs = await logService.fetchLogs();
    return logs.map(log => ({ id: log.id }));
}

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    console.log(id);
    return <Preview
        id={id}
    />
};