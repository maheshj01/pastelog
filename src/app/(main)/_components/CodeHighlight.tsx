import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import IconButton from './IconButton';
import { Theme } from './ThemeSwitcher';
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
    const dark = theme == Theme.DARK;
    const [copied, setCopied] = useState<boolean>(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    return (
        <div className='relative'>
            <IconButton
                className='absolute top-[-12px] right-[-12px]'
                onClick={handleCopy}
                ariaLabel="Copy to clipboard"
            >{!copied ?
                (<ContentCopyIcon
                    className='w-5 h-5'
                />)
                :
                (<DoneIcon
                    className={`w-5 h-5 ${dark ? 'text-white' : 'text-green-800'}`}
                />)
                }
            </IconButton>
            <SyntaxHighlighter
                customStyle={{
                    padding: '0.5em',
                    backgroundColor: 'var(--color-code-surface)',
                }}
                lineProps={{
                    style: {
                        wordBreak: 'break-all', whiteSpace: 'pre-wrap', paddingBottom: 1
                    }
                }}
                // wrapLines={true}
                {...rest}
                PreTag={'div'}
                showLineNumbers={true}
                language={language} style={theme == Theme.DARK ? a11yDark : docco}>
                {children}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;