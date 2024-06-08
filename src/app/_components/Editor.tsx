// src/_components/PSContent.tsx
import dynamic from "next/dynamic";
import React, { ChangeEvent } from "react";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeHighlight";
// import ReactMarkdown from 'react-markdown';
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
interface PSContentProps {
    className?: string;
    placeHolder?: string;
    value?: string;
    preview?: boolean;
    disabled?: boolean;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Editor: React.FC<PSContentProps> = ({ value, onChange, placeHolder, preview, disabled, className }) => {
    const placeholder: string =
        `Start typing here...
        \nPublish your logs to the cloud and access them from anywhere via a unique link.
        \nNo Sign up required.
        \n
        \nNote: Do not publish sensitive information here, these logs are public and can be accessed by anyone with the link.
    `;

    const customClass = `px-2 py-2 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary focus:dark:ring-gray-400 resize-y min-h-80 w-full reactMarkDown ${className}`;
    if (preview) {
        return (<div
            style={{
                height: "100%",
                maxHeight: "100%"
            }}
            className={`${customClass} mb-2`}>
            <ReactMarkdown
                className={customClass}
                components={{
                    code(props) {
                        const { children, className, node, ref, ...rest } = props
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                            <CodeBlock language={match[1]} {...props}>
                                {String(children).replace(/\n$/, '')}
                            </CodeBlock>
                        ) : (
                            <code {...rest} className={className}>
                                {children}
                            </code>
                        )
                    }
                }}
                remarkPlugins={[remarkGfm]}
                // rehypePlugins={[rehypeHighlight]}
                // eslint-disable-next-line react/no-children-prop
                children={value}
            />
        </div>
        );
    }
    return (
        <textarea
            className={`${customClass}`}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeHolder || placeholder}
            style={{
                height: "70vh",
                maxHeight: "100%"
            }}
        />
    );

};

export default Editor;
