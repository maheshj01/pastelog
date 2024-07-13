import React, { useCallback, useEffect } from 'react';

interface ShortcutWrapperProps {
    onCtrlShiftP: () => void;
    onCtrlShiftM: () => void;
    children: React.ReactNode;
}

const ShortcutWrapper: React.FC<ShortcutWrapperProps> = ({ onCtrlShiftP, onCtrlShiftM, children }) => {
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            onCtrlShiftP();
        }
        // toggle Sidebar ctrl+shift + h
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            onCtrlShiftM();
        }

    }, [onCtrlShiftP, onCtrlShiftM]);

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
