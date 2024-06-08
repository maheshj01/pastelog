import { useTheme } from 'next-themes';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
    language: string; // The programming language of the code block (e.g., 'javascript', 'python')
    children: string; // The code to be highlighted
}
/**
 *
 *
 * @param {*} { language, children, ...rest }
 * @return {*} 
 */
const CodeBlock: React.FC<CodeBlockProps> = ({ language, children, ...rest }) => {
    const { theme } = useTheme();
    return (
        <SyntaxHighlighter
            customStyle={{
                padding: '0.5em',
                backgroundColor: 'whiteSmoke',
            }}
            {...rest}
            PreTag={'div'}
            showLineNumbers={true}
            language={language} style={docco}>
            {children}
        </SyntaxHighlighter>
    );
};

export default CodeBlock;