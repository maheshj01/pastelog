import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

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

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(event);
        }
        const newValue = event.target.value;
        setInputValue(newValue);
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

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = inputValue.substring(start, end);

        const newValue =
            inputValue.substring(0, start) +
            `${syntax}${selectedText}${syntax}` +
            inputValue.substring(end);

        updateValue(newValue, start + syntax.length, end + syntax.length);
    };

    const applyLinkFormatting = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = inputValue.substring(start, end);

        const newValue =
            inputValue.substring(0, start) +
            `[${selectedText}]()` +
            inputValue.substring(end);

        updateValue(newValue, end + 3);
    };

    const applyListFormatting = (listSyntax: string) => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = inputValue.lastIndexOf('\n', start - 1) + 1;

        const newValue =
            inputValue.substring(0, lineStart) +
            listSyntax +
            inputValue.substring(lineStart);

        updateValue(newValue, start + listSyntax.length);
    };

    const applyCodeBlockFormatting = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = inputValue.substring(start, end);

        const newValue =
            inputValue.substring(0, start) +
            `\n\`\`\`\n${selectedText}\n\`\`\`\n` +
            inputValue.substring(end);

        updateValue(newValue, end + 8);
    };

    const applyBlockquoteFormatting = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = inputValue.lastIndexOf('\n', start - 1) + 1;

        const newValue =
            inputValue.substring(0, lineStart) +
            '> ' +
            inputValue.substring(lineStart);

        updateValue(newValue, start + 2);
    };

    const applyHeadingFormatting = (level: number) => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = inputValue.lastIndexOf('\n', start - 1) + 1;
        const headingSyntax = '#'.repeat(level) + ' ';

        const newValue =
            inputValue.substring(0, lineStart) +
            headingSyntax +
            inputValue.substring(lineStart);

        updateValue(newValue, start + headingSyntax.length);
    };

    const insertHorizontalRule = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newValue =
            inputValue.substring(0, start) +
            '\n---\n' +
            inputValue.substring(start);

        updateValue(newValue, start + 5);
    };

    const updateValue = (newValue: string, selectionStart: number, selectionEnd?: number) => {
        setInputValue(newValue);
        if (onChange) {
            const syntheticEvent = {
                target: { value: newValue }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange(syntheticEvent);
        }

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.selectionStart = selectionStart;
                inputRef.current.selectionEnd = selectionEnd || selectionStart;
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