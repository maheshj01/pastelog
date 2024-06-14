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

    // Update local state when prop value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Handle input change
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(event);
        }
        const newValue = event.target.value;
        setInputValue(newValue);
        if (!autoSuggest) {
            return;
        } else {
            const newCursorPosition = event.target.selectionStart ?? 0;
            setCursorPosition(newCursorPosition);

            if (newValue.endsWith(' ')) {
                setLoading(true);
                getSuggestion(newValue.trim()).then((suggestion) => {
                    setSuggestion(suggestion);
                    setLoading(false);
                });
            } else {
                setSuggestion('');
            }

        }
    };

    const getSuggestion = async (value: string) => {
        return new Promise<string>((resolve) => {
            // Simulating an async request for suggestion
            setTimeout(() => {
                const randomSuggestions = [
                    'is a great feature.',
                    'helps developers code faster.',
                    'improves productivity.',
                    'is powered by AI.',
                ];
                const randomIndex = Math.floor(Math.random() * randomSuggestions.length);
                const randomSuggestion = randomSuggestions[randomIndex];
                resolve(value + randomSuggestion);
            }, 2000);
        });
    }

    // Handle key down
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Tab' && suggestion) {
            event.preventDefault();
            const newValue = inputValue.substring(0, cursorPosition) + suggestion.substring(inputValue.trim().length) + ' ';
            setInputValue(newValue);
            setCursorPosition(cursorPosition + suggestion.substring(inputValue.trim().length).length + 1);
            setSuggestion('');
            if (onChange) {
                const syntheticEvent = { target: { value: newValue } } as React.ChangeEvent<HTMLTextAreaElement>;
                onChange(syntheticEvent);
            }
        }
    };

    // Update overlay position and content
    // useEffect(() => {
    //     if (inputRef.current && overlayRef.current) {
    //         const textareaStyles = window.getComputedStyle(inputRef.current);
    //         overlayRef.current.style.font = textareaStyles.font;
    //         overlayRef.current.style.lineHeight = textareaStyles.lineHeight;
    //         overlayRef.current.style.padding = textareaStyles.padding;

    //         const textBeforeCursor = inputValue.substring(0, cursorPosition);
    //         const lines = textBeforeCursor.split('\n');
    //         const currentLineText = lines[lines.length - 1];

    //         const textMetrics = measureText(currentLineText, overlayRef.current);
    //         const lineHeight = parseFloat(textareaStyles.lineHeight);

    //         overlayRef.current.style.left = `${textMetrics.width}px`;
    //         overlayRef.current.style.top = `${(lines.length - 1) * lineHeight + 2}px`;
    //         overlayRef.current.textContent = suggestion.substring(inputValue.trim().length);
    //     }
    // }, [inputValue, cursorPosition, suggestion]);

    // Measure text width
    const measureText = (text: string, element: HTMLElement) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = window.getComputedStyle(element).font;
            return context.measureText(text);
        }
        return { width: 0 };
    };

    return (
        <div className="relative inline-block w-full ">
            <textarea
                className={`${customClass}`}
                value={inputValue}
                onChange={handleChange}
                // onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                // ref={inputRef}
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
                    whiteSpace: 'pre-wrap', overflow: 'hidden'
                }}
            />

            {loading && (
                <div className="absolute -top-6 right-2 flex items-center justify-center">
                    <Image
                        width={32}
                        height={32}
                        src="/images/gemini.png" alt="Gemini" className='animate-pulse' />
                </div>
            )}
        </div>
    );
};

export default TextCompletionInput;