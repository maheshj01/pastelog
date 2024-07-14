
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";


export default function ShortCutsGuide() {

    const ShortcutsMap = [
        { keys: 'Ctrl/Cmd + H', description: 'Toggle Preview' },
        { keys: 'Ctrl/Cmd + P', description: 'Toggle Sidebar' },
        { keys: 'Ctrl/Cmd + D', description: 'Toggle DarkMode' },
        { keys: 'Ctrl/Cmd + B', description: 'Bold' },
        { keys: 'Ctrl/Cmd + I', description: 'Italic' },
        { keys: 'Ctrl/Cmd + Shift + X', description: 'Strikethrough' },
        { keys: 'Ctrl/Cmd + Shift + [1-6]', description: 'Heading' },
        { keys: 'Ctrl/Cmd + K', description: 'Link' },
        { keys: 'Ctrl/Cmd + E', description: 'Code' },
        { keys: 'Ctrl/Cmd + Shift + C', description: 'Code Block' },
        { keys: 'Ctrl/Cmd + U', description: 'Unordered List' },
        { keys: 'Ctrl/Cmd + Shift + O', description: 'Ordered List' },
        { keys: 'Ctrl/Cmd + Shift + .', description: 'Blockquote' },
        { keys: 'Ctrl/Cmd + Shift + -', description: 'Horizontal Rule' },
        { keys: 'Tab / Shift + Tab', description: 'Indent/Unindent Code Block' },
    ]
    return (<HoverCard>
        <HoverCardTrigger asChild>
            <div className='cursor-pointer'>
                <MdOutlineKeyboardCommandKey className='size-6 text-black dark:text-white' />
            </div>
        </HoverCardTrigger>
        <HoverCardContent side='top' align='start' className="z-30">
            <div className="p-4 bg-white dark:bg-gray-950 shadow-lg rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold"> Keyboard Shortcuts</div>
                </div>
                <div className="mt-2">
                    {[...Array(ShortcutsMap.length)].map((_, index) => {
                        const shortcut: any = ShortcutsMap[index];
                        return (
                            <div key={index}>
                                {index === 3 && <p className='text-md my-2 font-bold'>Markdown Shortcuts</p>}
                                <div className="flex justify-between">
                                    <div className="flex space-x-2">
                                        <MdOutlineKeyboardCommandKey className='text-black dark:text-white' />
                                        <span className="text-sm">{shortcut.keys}</span>
                                    </div>
                                    <span className="text-sm">{shortcut.description}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>
    );
}