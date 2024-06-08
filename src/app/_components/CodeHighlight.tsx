import { useTheme } from 'next-themes';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
    language: string; // The programming language of the code block (e.g., 'javascript', 'python')
    code: string; // The code to be highlighted
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
    const { theme } = useTheme();
    return (
        <SyntaxHighlighter
            customStyle={{
                backgroundColor: 'whitesmoke'
            }}
            showLineNumbers={true}
            language={language} style={docco}>
            {code}
        </SyntaxHighlighter>
    );
};

export default CodeBlock;