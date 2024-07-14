import React, { useCallback, useEffect } from 'react';

interface ShortcutWrapperProps {
    onCtrlShiftP?: () => void;
    onCtrlShiftH?: () => void;
    onCtrlShiftN?: () => void;
    onCtrlShiftD?: () => void;
    children: React.ReactNode;
}

const ShortcutWrapper: React.FC<ShortcutWrapperProps> = ({ onCtrlShiftP, onCtrlShiftH, onCtrlShiftN, onCtrlShiftD, children }) => {
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
            event.preventDefault();
            if (onCtrlShiftP) {
                onCtrlShiftP();
            }
        }
        // toggle Sidebar ctrl+shift + h
        if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
            event.preventDefault();
            if (onCtrlShiftH) {
                onCtrlShiftH();
            }
        }
        // new log
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            if (onCtrlShiftN) {
                onCtrlShiftN();
            }
        }
        // toggle darkMode
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault();
            if (onCtrlShiftD) {
                onCtrlShiftD();
            }
        }
    }, [onCtrlShiftP, onCtrlShiftH, onCtrlShiftN, onCtrlShiftD]);

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
