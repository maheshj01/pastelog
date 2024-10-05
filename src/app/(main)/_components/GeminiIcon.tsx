import { Tooltip, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';
import { useSidebar } from '../_services/Context';
import GeminiDialog from './GeminiDialog';

interface GeminiProps {
    title: string;
    content: string;
    onGeminiTrigger: () => void;
    className: string;
}

const GeminiIcon: React.FC<GeminiProps> = ({ title, content, onGeminiTrigger, className }) => {
    const geminiContent = {
        title: "Gemini",
        content: 'With the power of Gemini, you can summarize long notes content. Enter your API key to get started.',
    };
    const { isOpen: geminiOpen, onOpen: onGeminiOpen, onClose: onGeminiClose } = useDisclosure();
    const { setApiKey } = useSidebar();
    const onGeminiApiSave = (key: string) => {
        if (key) {
            setApiKey(key);
        }
    };

    return (
        <>
            <Tooltip
                content="Tap to Summarize"
                placement='top-start'>
                <Image
                    src={"/images/gemini.png"}
                    alt="Logo"
                    width={32}
                    height={32}
                    onClick={onGeminiTrigger}
                    className={`cursor-pointer transition-transform duration-500 transform hover:scale-150 h-8 m-0 p-0 ${className}`}
                />
            </Tooltip>
            <GeminiDialog
                isOpen={geminiOpen}
                onClose={onGeminiClose}
                onSave={onGeminiApiSave}
                title={geminiContent.title}
                content={geminiContent.content}
            />
        </>
    );
};

export default GeminiIcon;

