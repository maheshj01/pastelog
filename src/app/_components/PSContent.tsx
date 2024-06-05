// src/_components/PSContent.tsx
import React, { ChangeEvent } from "react";

interface PSContentProps {
    className?: string;
    placeHolder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const PSContent: React.FC<PSContentProps> = ({ value, onChange, placeHolder, className }) => {
    const placeholder: string =
        `Start typing here...
        \nPublish your logs to the cloud and access them from anywhere via a unique link.
        \nNo Sign up required.
        \n
        \nNote: Do not publish sensitive information here, these logs are public and can be accessed by anyone with the link.
    `;
    return (
        <textarea
            value={value || ''}
            onChange={onChange}
            placeholder={placeHolder || placeholder}
            style={{
                height: "70vh",
                maxHeight: "80vh"
            }} // Set height to 80% of viewport height
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-80 w-full md:w-3/4 lg:w-2/3 ${className}`}
        />
    );
};

export default PSContent;
