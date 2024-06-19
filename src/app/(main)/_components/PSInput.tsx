// src/_components/PSInput.tsx
import React, { ChangeEvent } from "react";

interface DescriptionInputProps {
    className?: string;
    placeHolder?: string;
    value?: string;
    disabled?: boolean,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PSInput: React.FC<DescriptionInputProps> = ({ value, onChange, disabled, placeHolder, className }) => {
    return (
        <input
            type="text"
            value={value || ''}
            onChange={onChange}
            placeholder={placeHolder || ''}
            disabled={disabled}
            className={`px-4 py-2 border-3 bg-background rounded-lg border-surface focus:ring-secondary focus:outline-none focus:ring-2 w-full md:w-3/4 lg:w-2/3 ${className}`}
        />
    );
};

export default PSInput;
