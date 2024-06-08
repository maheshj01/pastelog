import { useRef, useState } from 'react';

// Example suggestions
const suggestionsList = [
    'apple',
    'banana',
    'orange',
    'grape',
    'pear',
    'pineapple',
    'peach',
    'mango',
    'melon',
    'strawberry'
];

const TextCompletionInput = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [position, setPosition] = useState(0);
    const [typing, setTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Handle input change
    const handleChange = (event: any) => {
        setTyping(true);
        const value = event.target.value;
        setInputValue(value);
        const cursorPosition = event.target.selectionStart;
        setPosition(cursorPosition);

        if (value.endsWith(' ')) {
            setLoading(true);
            setTyping(false);
            // sleep for 1 second to simulate a request
            setTimeout(() => {
                const randomSuggestion = suggestionsList[Math.floor(Math.random() * suggestionsList.length)];
                console.log(randomSuggestion);
                setSuggestion(randomSuggestion);
                setLoading(false);
            }, 2000);
        } else {
            setLoading(false);
        }
    };

    // Handle key down
    const handleKeyDown = (event: any) => {
        if (event.key === 'Tab' && suggestion) {
            event.preventDefault();
            setInputValue((prev) => prev + suggestion.substring(inputValue.length));
            setSuggestion('');
        }
    };

    // Calculate the width of the input value up to the cursor position
    const calculateWidth = (text: string) => {
        if (inputRef.current) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (context) {
                const style = window.getComputedStyle(inputRef.current);
                context.font = style.font;
                return context.measureText(text).width;
            }
        }
        return 0;
    };

    return (
        <div className="relative inline-block w-128 my-4">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type to get suggestions..."
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', boxSizing: 'border-box', backgroundColor: 'transparent' }}
                ref={inputRef}
            />
            <div className="relative">
                <span style={{ visibility: 'hidden', whiteSpace: 'pre' }}>{inputValue.substring(0, position)}</span>
                {loading || typing ? null : (
                    <span style={{
                        position: 'absolute',
                        left: calculateWidth(inputValue.substring(0, position)),
                        top: 0,
                        color: '#aaa'
                    }}>
                        {suggestion.substring(inputValue.length)}
                    </span>
                )}
            </div>
            <div className="h-6"></div>
        </div>
    );
};

export default TextCompletionInput;
