
import PreviewPage from '@/app/(main)/_components/PreviewPage';
import LogService from '@/app/(main)/_services/logService';
import { Constants } from '@/app/constants';
import { Metadata, ResolvingMetadata } from 'next';

// This is required for dynamic routing in runtime
export const dynamicParams = true;

type Props = {
    params: {
        id: string;
    };
    searchParams: URLSearchParams;
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id

    const log = await new LogService().importLog(id);

    return {
        title: log?.title || 'Pastelog',
        description: log?.data || Constants.description
    }
}

export default function PublishPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <PreviewPage
        logId={id}
    />
};