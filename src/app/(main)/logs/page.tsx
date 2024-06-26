"use client";
import { useSearchParams } from 'next/navigation';
import Pastelog from "../_components/Pastelog";

export default function LogsPage() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    console.log(id);
    return (
        <div className={`grow`}>
            {/* Main content */}
            <div className="flex flex-col h-full">
                <Pastelog
                    id={id!}
                />
            </div>
        </div>
    );
}