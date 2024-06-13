// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useState } from 'react';
import Log from './_models/Log';
import { SidebarContext } from './_services/Context';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}


export function SidebarProvider({ children }: { children: ReactNode }) {
    const [id, setId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Log | null>(null);
    const [showSideBar, setShowSideBar] = useState<boolean>(true);

    const toggleSideBar = () => setShowSideBar((prevState) => !prevState);

    return (
        <SidebarContext.Provider value={{ id, selected, showSideBar, setId, setSelected, setShowSideBar, toggleSideBar }
        }>
            {children}
        </SidebarContext.Provider>
    );
}

