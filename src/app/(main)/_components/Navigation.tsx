import Image from 'next/image';

interface NavigationProps {
    darkTheme: boolean;
    index: number | null;
    scrollToSection: (index: number) => void;
}

export function Navigation({ darkTheme, index, scrollToSection }: NavigationProps) {
    const sectionTitles = [
        'Introduction',
        'Beautiful Markdown',
        'Powered By Gemini',
        'Keyboard Shortcuts',
        'Create and Share',
        'Dark Mode',
        'Save Locally'
    ];

    return (
        <div className={`${darkTheme ? 'bg-gray-800' : 'bg-gray-900'} fixed top-0 left-0 right-0 flex justify-center py-2 px-6 z-50`}>
            <div className="fixed top-0 left-0 py-6 px-6 h-32 w-32 z-200">
                <Image
                    src={'/images/frame.png'}
                    alt="Logo"
                    width={70}
                    height={70}
                    className="transition-transform duration-500 transform hover:scale-105"
                />
            </div>
            <div className={'flex flex-wrap items-center justify-center gap-2 mb-2 rounded-3xl p-4 border-2'}>
                {sectionTitles.slice(1).map((title, secIndex) => (
                    <div
                        key={secIndex}
                        className={`px-4 py-2 cursor-pointer ${index == secIndex ? 'text-primary' : 'text-white'}`}
                        onClick={() => scrollToSection(secIndex + 1)}
                    >
                        {title}
                    </div>
                ))}
            </div>
        </div>
    );
} 