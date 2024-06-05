// src/_components/PSInput.tsx
import React, { ChangeEvent } from "react";

interface DescriptionInputProps {
    className?: string;
    placeHolder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PSInput: React.FC<DescriptionInputProps> = ({ value, onChange, placeHolder, className }) => {
    return (
        <input
            type="text"
            value={value || ''}
            onChange={onChange}
            placeholder={placeHolder || ''}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-3/4 lg:w-2/3 ${className}`}
        />
    );
};

export default PSInput;
