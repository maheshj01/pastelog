'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Pastelog from '../_components/Pastelog';

function LogsContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    return (
        <div className={'grow'}>
            <div className="flex flex-col h-full">
                <Pastelog id={id!} />
            </div>
        </div>
    );
}

export default function LogsPage() {
    return (
        <Suspense fallback={<div className='flex justify-center items-center min-h-screen'>Loading...</div>}>
            <LogsContent />
        </Suspense>
    );
}