
import { Constants } from '@/app/constants';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@radix-ui/react-hover-card';
import { MdOutlineKeyboardCommandKey } from 'react-icons/md';


export default function ShortCutsGuide() {

    const ShortcutsMap = [
        { keys: '+ P', description: 'Toggle Preview' },
        { keys: '+ S', description: 'Toggle Sidebar' },
        { keys: '+ D', description: 'Toggle DarkMode' },
        { keys: '+ N', description: 'Add a New Note' },
        { keys: '+ B', description: 'Bold' },
        { keys: '+ I', description: 'Italic' },
        { keys: '+ Shift + X', description: 'Strikethrough' },
        { keys: '+ Shift + [1-6]', description: 'Heading' },
        { keys: '+ K', description: 'Link' },
        { keys: '+ E', description: 'Code' },
        { keys: '+ Shift + C', description: 'Code Block' },
        { keys: '+ U', description: 'Unordered List' },
        { keys: '+ Shift + O', description: 'Ordered List' },
        { keys: '+ Shift + .', description: 'Blockquote' },
        { keys: '+ Shift + -', description: 'Horizontal Rule' },
        { keys: 'Tab / Shift + Tab', description: 'Indent/Unindent Code Block' },
    ]
    return (<HoverCard>
        <HoverCardTrigger asChild>
            <div className='cursor-pointer'>
                <MdOutlineKeyboardCommandKey className={Constants.styles.iconTheme} />
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
                                {index === 4 && <p className='text-md my-2 font-bold'>Markdown Shortcuts</p>}
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <MdOutlineKeyboardCommandKey className='text-black dark:text-white mt-[0.5px]' />
                                        {/* <MdOutlineKeyboardControlKey className='text-black dark:text-white' /> */}
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