import { Tooltip, useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useSidebar } from '../_services/Context';
import GeminiDialog from './GeminiDialog';
import Analytics from '../_services/Analytics';

interface GeminiProps {
    onGeminiTrigger: () => void;
    className?: string;
    children?: React.ReactNode;
    toolTip?: string;
}

const GeminiIcon: React.FC<GeminiProps> = ({ onGeminiTrigger, className, children, toolTip }) => {
    const geminiContent = {
        title: "Gemini",
        content: 'With the power of Gemini, you can summarize long notes content. Enter your API key to get started.',
    };
    const { isOpen: geminiOpen, onOpen: onGeminiOpen, onClose: onGeminiClose } = useDisclosure();
    const { apiKey, setApiKey } = useSidebar();
    const onGeminiApiSave = (key: string) => {
        if (key) {
            setApiKey(key);
        }
    };

    return (
        <div className={className}>
            <Tooltip
                content={toolTip || "Tap to Summarize"}
                placement='top-start'>
                <div onClick={() => {
                    if (apiKey === undefined || apiKey === null || apiKey === '') {
                        onGeminiOpen();
                    } else {
                        onGeminiTrigger();
                    }
                }}>
                    {children}
                </div>
            </Tooltip>
            <GeminiDialog
                isOpen={geminiOpen}
                onClose={onGeminiClose}
                onSave={onGeminiApiSave}
                title={geminiContent.title}
                content={geminiContent.content}
            />
        </div>
    );
};

export default GeminiIcon;

