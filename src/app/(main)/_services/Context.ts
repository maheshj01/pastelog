// Context.tsx

import { createContext, useContext } from 'react';
import Log from '../_models/Log';

interface SidebarContextProps {
    id: string | null;
    selected: Log | null;
    showSideBar: boolean;
    setId: (id: string | null) => void;
    setSelected: (log: Log | null) => void;
    setShowSideBar: (showSideBar: boolean) => void;
    toggleSideBar: () => void;  // Include toggleSideBar in the context props
}

export const SidebarContext = createContext<SidebarContextProps>({
    id: null,
    selected: null,
    showSideBar: false,
    setId: () => { },
    setSelected: () => { },
    setShowSideBar: () => { },
    toggleSideBar: () => { },  // Default implementation
});

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
