"use client";

import { PSNavbarProvider } from '@/lib/Context/PSNavbarProvider';
import { store } from '@/lib/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../_components/ThemeProvider';
import AppLayout from './app_layout';

export default function LogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                themes={['purple', 'red', 'blue', 'green', 'dark']}
                disableTransitionOnChange>
                <PSNavbarProvider>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </PSNavbarProvider>
            </ThemeProvider>
        </Provider>
    );
}
