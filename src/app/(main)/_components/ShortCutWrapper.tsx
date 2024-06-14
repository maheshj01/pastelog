import React, { useEffect, useCallback } from 'react';

interface ShortcutWrapperProps {
    onCtrlP: () => void;
    children: React.ReactNode;
}

const ShortcutWrapper: React.FC<ShortcutWrapperProps> = ({ onCtrlP, children }) => {
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            onCtrlP();
        }
    }, [onCtrlP]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div>
            {children}
        </div>
    );
};

export default ShortcutWrapper;
