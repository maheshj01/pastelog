// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react';
import { User as FirebaseUser } from 'firebase/auth';
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
    const [showSideBar, setShowSideBar] = useState<boolean>(true);
    const [apiKey, setApiKey] = useState<string | null>(null);  // Add apiKey to the state
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const toggleSideBar = () => setShowSideBar((prevState) => !prevState);

    return (
        <SidebarContext.Provider value={{
            id, selected, showSideBar, setId, setSelected,
            user, setUser, setShowSideBar, toggleSideBar, apiKey, setApiKey,
        }
        }>
            {children}
        </SidebarContext.Provider>
    );
}

