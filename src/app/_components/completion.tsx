import React, { useEffect, useRef, useState } from 'react';

const TextCompletionInput: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle input change
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        const newCursorPosition = event.target.selectionStart ?? 0;
        setInputValue(value);
        setCursorPosition(newCursorPosition);

        if (value.endsWith(' ')) {
            setLoading(true);
            getSuggestion(value.trim()).then((suggestion) => {
                setSuggestion(suggestion);
                setLoading(false);
            });
        } else {
            setSuggestion('');
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
            }, 1000); // Increased to 1 second to better see the loader
        });
    }


    // Handle key down
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Tab' && suggestion) {
            event.preventDefault();
            const newValue = inputValue.substring(0, cursorPosition) + suggestion.substring(inputValue.trim().length) + ' ';
            setInputValue(newValue);
            setCursorPosition(newValue.length);
            setSuggestion('');
        }
    };

    // Update overlay position and content
    useEffect(() => {
        if (inputRef.current && overlayRef.current) {
            const textareaStyles = window.getComputedStyle(inputRef.current);
            overlayRef.current.style.font = textareaStyles.font;
            overlayRef.current.style.lineHeight = textareaStyles.lineHeight;
            overlayRef.current.style.padding = textareaStyles.padding;

            const textBeforeCursor = inputValue.substring(0, cursorPosition);
            const lines = textBeforeCursor.split('\n');
            const currentLineText = lines[lines.length - 1];

            const textMetrics = measureText(currentLineText, overlayRef.current);
            const lineHeight = parseFloat(textareaStyles.lineHeight);

            overlayRef.current.style.left = `${textMetrics.width}px`;
            overlayRef.current.style.top = `${(lines.length - 1) * lineHeight + 2}px`;
            overlayRef.current.textContent = suggestion.substring(inputValue.trim().length);
        }
    }, [inputValue, cursorPosition, suggestion]);

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
        <div className="relative inline-block w-full my-4">
            <textarea
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent min-h-64 bg-gray-600"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type to get suggestions..."
                ref={inputRef}
            />
            <div
                ref={overlayRef}
                className="absolute pointer-events-none text-gray-400"
                style={{ whiteSpace: 'pre-wrap', overflow: 'hidden' }}
            />

            {loading && (
                <div className="absolute bottom-4 right-4 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default TextCompletionInput;