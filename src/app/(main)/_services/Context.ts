// Context.tsx

import { createContext, useContext } from 'react';
import Log from '../_models/Log';

interface SidebarContextProps {
    id: string | null;
    apiKey: string | null;
    selected: Log | null;
    showSideBar: boolean;
    setId: (id: string | null) => void;
    setSelected: (log: Log | null) => void;
    setShowSideBar: (showSideBar: boolean) => void;
    setApiKey: (apiKey: string | null) => void;
    toggleSideBar: () => void;  // Include toggleSideBar in the context props
}

export const SidebarContext = createContext<SidebarContextProps>({
    id: null,
    selected: null,
    apiKey: null,
    showSideBar: false,
    setId: () => { },
    setApiKey: () => { },
    setSelected: () => { },
    setShowSideBar: () => { },
    toggleSideBar: () => { },
});

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
