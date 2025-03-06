// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react';
import { ReactNode, useState } from 'react';
import { SidebarContext } from './(main)/_hooks/useSidebar';
import Log from './(main)/_models/Log';
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
    const [apiKey, setApiKey] = useState<string | null>(null);  // Add apiKey to the state

    return (
        <SidebarContext.Provider value={{
            apiKey, setApiKey,
        }
        }>
            {children}
        </SidebarContext.Provider>
    );
}

