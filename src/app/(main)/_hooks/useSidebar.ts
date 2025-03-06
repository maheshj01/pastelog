// Context.tsx

import { createContext, useContext } from 'react';
import Log from '../_models/Log';

interface SidebarContextProps {
    id: string | null;
    apiKey: string | null;
    selected: Log | null;
    setId: (id: string | null) => void;
    setSelected: (log: Log | null) => void;
    setApiKey: (apiKey: string | null) => void;
}

export const SidebarContext = createContext<SidebarContextProps>({
    id: null,
    selected: null,
    apiKey: null,
    setId: () => { },
    setApiKey: () => { },
    setSelected: () => { },
});

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
