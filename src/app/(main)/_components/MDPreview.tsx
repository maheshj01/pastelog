// src/_components/PSContent.tsx
import { Tooltip } from "@nextui-org/react";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeHighlight";
// import ReactMarkdown from 'react-markdown';
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface MDPreviewProps {
    value?: string;
    className?: string;
}

const MDPreview = ({ value, className }: MDPreviewProps) => {
    const customClass = `px-2 py-2 rounded-b-lg border-surface focus:ring-secondary focus:outline-none focus:ring-2 resize-y min-h-60 w-full reactMarkDown ${className}`;

    function LinkRenderer(props: any) {
        return (
            <Tooltip
                className="cursor-pointer"
                onClick={(e) => window.open(props.href, '_blank')}
                content={props.href.length > 50 ? props.href.substring(0, 50) + '...' : props.href}
                placement='top-start'>
                <a href={props.href} target="_blank" rel="noreferrer">
                    {props.children}
                </a>
            </Tooltip>
        );
    }
    return <div
        id='preview'
        style={{
            height: "100%",
            maxHeight: "100%"
        }}>
        <ReactMarkdown
            className={`${customClass} mb-2`}
            components={{
                a: LinkRenderer,
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
}

export default MDPreview;