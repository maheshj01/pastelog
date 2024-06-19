"use client";
import { formatReadableDate } from '@/utils/utils';
import { useEffect, useState } from 'react';
import Log from '../_models/Log';
import LogService from '../_services/logService';

const Preview = ({ logId }: { logId: string }) => {
    const logService = new LogService();
    const [loading, setLoading] = useState<boolean>(true);
    const [previewLog, setpreviewLog] = useState<Log | null>(null);

    async function fetchLogsById() {
        setLoading(true);
        const log = await logService.fetchLogById(logId);
        if (!log) {
            setLoading(false);
            // handle not found case, maybe show an error message
            return;
        }
        setpreviewLog(log);
        setLoading(false);
    }

    useEffect(() => {
        if (logId) {
            fetchLogsById();
        }
    }, [logId]);
    return (
        <div className={`flex flex-col items-center h-fit`}>
            <div className="w-full md:w-3/4 lg:w-2/3 max-w-none px-1 prose prose-indigo dark:prose-dark">
                <div className='flex flex-col'>
                    <p className="text-black dark:text-slate-50 my-1">{previewLog?.title}</p>

                    {(
                        !loading &&
                        <div className='flex flex-row justify-between'>
                            {
                                previewLog?.expiryDate ?
                                    <div>
                                        <p className="text-black dark:text-slate-50 my-1 font-bold">
                                            {`Expires`}
                                        </p>
                                        <p className="text-black dark:text-slate-50 my-1"> {` ${formatReadableDate(previewLog?.expiryDate)}`}</p>
                                    </div>
                                    : <div></div>

                            }
                        </div>
                    )
                    }
                    <div className="relative">
                        {previewLog?.data}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Preview;