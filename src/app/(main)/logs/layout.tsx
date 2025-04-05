"use client";

import { PSNavbarProvider } from '@/lib/Context/PSNavbarProvider';
import { store } from '@/lib/store';
import { Provider } from 'react-redux';
import AppLayout from './app_layout';
import { useDisclosure } from '@nextui-org/react';
import { SearchDialog } from '../_components/Dialog/SearchDialog';

export default function LogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PSNavbarProvider>
                <AppLayout>
                    {children}
                </AppLayout>
            </PSNavbarProvider>
        </Provider>
    );
}
