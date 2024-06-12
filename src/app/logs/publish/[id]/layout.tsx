"use client";

import { useSidebar } from '../../../_services/Context';

export default function PublishLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    );
}