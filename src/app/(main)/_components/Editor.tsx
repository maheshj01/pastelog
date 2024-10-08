// src/_components/PSContent.tsx
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef } from "react";
import { EditorState } from "../_services/EditorState";
import MDPreview from "./MDPreview";
import TextCompletionInput from "./completion";
// import ReactMarkdown from 'react-markdown';
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
interface PSEditorProps {
    className?: string;
    placeHolder?: string;
    value?: string;
    preview?: boolean;
    disabled?: boolean;
    isRepublish?: boolean;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Editor: React.FC<PSEditorProps> = ({ value, onChange, placeHolder, preview, disabled, className, isRepublish }) => {
    const editorStateRef = useRef(new EditorState(value || ''));

    useEffect(() => {
        editorStateRef.current.setCurrentValue(value || '');
    }, [value]);


    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        editorStateRef.current.updateValue(newValue);

        if (onChange) {
            onChange(event);
        }
    };

    const handleUndo = () => {
        const previousValue = editorStateRef.current.undo();
        if (previousValue !== null) {
            updateEditorState(previousValue);
        }
    };

    const handleRedo = () => {
        const nextValue = editorStateRef.current.redo();
        if (nextValue !== null) {
            updateEditorState(nextValue);
        }
    };

    const updateEditorState = (newValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: { value: newValue }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange(syntheticEvent);
        }
    };

    const placeholder: string =
        `Start typing here...
    \nPublish your logs to the cloud and access them from anywhere via a unique link.
    \nNo Sign up required.
    \n
    \nNote: Do not publish sensitive information here, these logs are public and can be accessed by anyone with the link.
    `;
    const pathName = usePathname();
    const isPublishRoute = pathName.includes('/logs/publish');
    const customClass = `px-2 py-2 rounded-b-lg border-surface focus:ring-secondary focus:outline-none focus:ring-2 focus:ring-2 resize-y min-h-80 w-full ${className}`;

    var previewClass = '';
    if (preview) {
        previewClass = 'fade-in-animation';
    } else {

        previewClass = 'fade-out-animation'
    };
    return (
        <div className="relative">
            {preview ? (
                // if value is empty, show placeholder
                value ? (
                    <MDPreview
                        className={`${customClass} reactMarkDown ${previewClass}`}
                        value={value}
                    />
                ) : (!isPublishRoute &&
                    <div className={`flex justify-center items-center rounded-b-lg ${customClass}`} >
                        <p>Nothing to Preview</p>
                    </div>)
            ) : (
                <TextCompletionInput
                    customClass={`${customClass} line-break ${!preview ? 'fade-in-animation' : 'fade-out-animation'}`}
                    // We need editor state only when editing
                    value={isRepublish ? value : editorStateRef.current?.getCurrentValue()}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder={placeHolder || placeholder}
                    height="70vh"
                    autoSuggest={false}
                    maxHeight="100%"
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                />
            )}
        </div>
    )

};

export default Editor;
