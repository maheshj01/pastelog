'use client';

import { PSNavbarProvider } from '@/lib/Context/PSNavbarProvider';
import { store } from '@/lib/store';
import { Provider } from 'react-redux';
import PSNavbar from '../(main)/_components/PSNavbar';
import { ThemeProvider } from '../(main)/_components/ThemeProvider';

export default function PublishLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <Provider store={store}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    themes={['purple', 'red', 'blue', 'green', 'dark']}
                    disableTransitionOnChange>
                    <PSNavbarProvider>
                        <PSNavbar />
                        {children}
                    </PSNavbarProvider>
                </ThemeProvider>
            </Provider>
        </div >
    );
}