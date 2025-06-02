import PreviewPage from '@/app/(main)/_components/PreviewPage';
import { Constants } from '@/app/constants';
import { Metadata, ResolvingMetadata } from 'next';
import LogService from '../../_services/logService';

type Props = {
    params: {
        id: string;
    };
    searchParams: URLSearchParams;
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;
    const log = await new LogService().importLog(id);
    const meta = {
        title: log?.title || 'Pastelog',
        description:
            log?.data || Constants.description,
        url: `https://pastelog.vercel.app/logs/${id}`,
        openGraph: {
            type: 'website',
            siteName: 'Pastelog',
            title: log?.title || 'Pastelog',
            description:
                log?.data || Constants.description,
            url: `https://pastelog.vercel.app/logs/${id}`,
            images: [
                {
                    url: '/images/frame.png',
                    width: 512,
                    height: 512,
                    alt: 'Pastelog',
                },
            ],
        },
    };
    return meta;
}

export default function LogPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <PreviewPage logId={id} />;
}
