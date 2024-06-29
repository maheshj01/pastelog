// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react';
import { ReactNode, useState } from 'react';
import Log from './(main)/_models/Log';
import { SidebarContext } from './(main)/_services/Context';

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
    const [apiKey, setApiKey] = useState<string | null>(null);  // Add apiKey to the state

    const toggleSideBar = () => setShowSideBar((prevState) => !prevState);

    return (
        <SidebarContext.Provider value={{ id, selected, showSideBar, setId, setSelected, setShowSideBar, toggleSideBar, apiKey, setApiKey, }
        }>
            {children}
        </SidebarContext.Provider>
    );
}

