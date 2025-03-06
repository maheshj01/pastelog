// Context.tsx

import { createContext, useContext } from 'react';
import Log from '../_models/Log';

interface SidebarContextProps {
    apiKey: string | null;
    setApiKey: (apiKey: string | null) => void;
}

export const SidebarContext = createContext<SidebarContextProps>({
    apiKey: null,
    setApiKey: () => { },
});

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
