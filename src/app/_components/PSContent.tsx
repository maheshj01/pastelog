// src/_components/PSContent.tsx
import React, { ChangeEvent } from "react";

interface PSContentProps {
    className?: string;
    placeHolder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const PSContent: React.FC<PSContentProps> = ({ value, onChange, placeHolder, className }) => {
    return (
        <textarea
            value={value || ''}
            onChange={onChange}
            placeholder={placeHolder || 'Write your blog here...'}
            style={{ height: "70vh" }} // Set height to 80% of viewport height
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none md:w-3/4 lg:w-2/3 ${className}`}
        />
    );
};

export default PSContent;
