import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { MarkdownFormatter } from '../_services/MDFormatter';

interface TextCompletionInputProps {
    customClass?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    height?: string;
    maxHeight?: string;
    autoSuggest?: boolean;
}

const TextCompletionInput: React.FC<TextCompletionInputProps> = ({
    customClass = '',
    value = '',
    onChange,
    disabled = false,
    placeholder = "Type to get suggestions...",
    height = "70vh",
    maxHeight = "100%",
    autoSuggest = false,
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestion, setSuggestion] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const markdownFormatter = useRef(new MarkdownFormatter(value));

    useEffect(() => {
        setInputValue(value);
        markdownFormatter.current.setValue(value);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(event);
        }
        const newValue = event.target.value;
        setInputValue(newValue);
        markdownFormatter.current.setValue(newValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key.toLowerCase()) {
                case 'b':
                    event.preventDefault();
                    applyFormatting('**');
                    break;
                case 'i':
                    event.preventDefault();
                    applyFormatting('*');
                    break;
                case 'e':
                    event.preventDefault();
                    applyFormatting('`');
                    break;
                case 'k':
                    event.preventDefault();
                    applyLinkFormatting();
                    break;
                case 'u':
                    event.preventDefault();
                    applyListFormatting('- ');
                    break;
            }
        }
        if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
            switch (event.key.toLowerCase()) {
                case 'x':
                    event.preventDefault();
                    applyFormatting('~~');
                    break;
                case 'c':
                    event.preventDefault();
                    applyCodeBlockFormatting();
                    break;
                case 'o':
                    event.preventDefault();
                    applyListFormatting('1. ');
                    break;
                case '.':
                    event.preventDefault();
                    applyBlockquoteFormatting();
                    break;
                case '-':
                    event.preventDefault();
                    insertHorizontalRule();
                    break;
            }
        }
        if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '6') {
            event.preventDefault();
            applyHeadingFormatting(parseInt(event.key));
        }
    };

    const applyFormatting = (syntax: string) => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const { value, newCursorPos } = markdownFormatter.current.applyFormatting(
            textarea.selectionStart,
            textarea.selectionEnd,
            syntax
        );
        updateValue(value, newCursorPos);
    };

    const applyLinkFormatting = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const { value, newCursorPos } = markdownFormatter.current.applyLinkFormatting(
            textarea.selectionStart,
            textarea.selectionEnd
        );
        updateValue(value, newCursorPos);
    };

    const applyListFormatting = (listSyntax: string) => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const { value, newCursorPos } = markdownFormatter.current.applyListFormatting(
            textarea.selectionStart,
            listSyntax
        );
        updateValue(value, newCursorPos);
    };

    const applyCodeBlockFormatting = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const { value, newCursorPos } = markdownFormatter.current.applyCodeBlockFormatting(
            textarea.selectionStart,
            textarea.selectionEnd
        );
        updateValue(value, newCursorPos);
    };

    const applyBlockquoteFormatting = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const { value, newCursorPos } = markdownFormatter.current.applyBlockquoteFormatting(
            textarea.selectionStart
        );
        updateValue(value, newCursorPos);
    };

    const applyHeadingFormatting = (level: number) => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const { value, newCursorPos } = markdownFormatter.current.applyHeadingFormatting(
            textarea.selectionStart,
            level
        );
        updateValue(value, newCursorPos);
    };

    const insertHorizontalRule = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const { value, newCursorPos } = markdownFormatter.current.insertHorizontalRule(
            textarea.selectionStart
        );
        updateValue(value, newCursorPos);
    };

    const updateValue = (newValue: string, newCursorPos: number) => {
        setInputValue(newValue);
        if (onChange) {
            const syntheticEvent = {
                target: { value: newValue }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange(syntheticEvent);
        }

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.selectionStart = newCursorPos;
                inputRef.current.selectionEnd = newCursorPos;
                inputRef.current.focus();
            }
        }, 0);
    };

    return (
        <div className="relative inline-block w-full">
            <textarea
                className={`${customClass}`}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                ref={inputRef}
                style={{
                    height,
                    maxHeight,
                }}
            />
            <div
                ref={overlayRef}
                className="absolute pointer-events-none text-gray-400"
                style={{
                    width: inputRef.current?.offsetWidth ?? 0,
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden'
                }}
            />
            {loading && (
                <div className="absolute -top-6 right-2 flex items-center justify-center">
                    <Image
                        width={32}
                        height={32}
                        src="/images/gemini.png"
                        alt="Gemini"
                        className='animate-pulse'
                    />
                </div>
            )}
        </div>
    );
};

export default TextCompletionInput;