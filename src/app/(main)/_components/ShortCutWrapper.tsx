import React, { useCallback, useEffect } from 'react';

interface ShortcutWrapperProps {
    // callback function to handle shortcut key press with key as argument
    onShortCutClick?: (key: string) => void;
    children: React.ReactNode;
}

const ShortcutWrapper: React.FC<ShortcutWrapperProps> = ({ onShortCutClick, children }) => {
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && (event.key == 'p' || event.key == 'n' || event.key == 's' || event.key == 'd')) {
            event.preventDefault();
            if (onShortCutClick) {
                onShortCutClick(event.key);
            }
        }
    }, [onShortCutClick]);

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
