// app/(main)/logs/layout.tsx
"use client";

import { PSNavbarProvider } from '@/lib/Context/PSNavbarProvider';
import { store } from '@/lib/store';
import { Provider } from 'react-redux';
import AppLayout from './app_layout';

export default function LogsLayout({ children, settings }: { children: React.ReactNode, settings: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PSNavbarProvider>
                <AppLayout>
                    {settings}
                    {children}
                </AppLayout>
            </PSNavbarProvider>
        </Provider>
    );
}
