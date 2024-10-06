"use client";
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSidebar } from '../_hooks/useSidebar';
import Analytics from '../_services/Analytics';

export default function RouteClient() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { showSideBar, setShowSideBar, id } = useSidebar();

    const handleRouteChange = (url: string) => {
        switch (url) {
            case '/':
                Analytics.logPageView(url, 'Welcome');
                break;
            case '/logs':
                Analytics.logPageView(url, 'New Log');
                break;
            case `/logs/${id}`:
                Analytics.logPageView(url, 'individual log');
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        handleRouteChange(pathName)
    }, [pathName, searchParams]);

    return null;
}