"use client";
import { RootState } from '@/lib/store';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Analytics from '../_services/Analytics';

export default function RouteClient() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const id = useSelector((state: RootState) => state.sidebar.id);

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