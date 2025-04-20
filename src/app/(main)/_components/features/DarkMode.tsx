import Image from 'next/image';
import { Button } from '../button';

interface DarkModeProps {
    darkTheme: boolean;
    toggleTheme: () => void;
}

export function DarkMode({ darkTheme, toggleTheme }: DarkModeProps) {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen pt-8">
            <div className="flex flex-col items-center justify-between w-full max-w-3xl">
                <p className="text-3xl my-8 text-center">
                    Dark Mode
                </p>
                <p className="text-center">Toggle between dark and light themes</p>
                <Button
                    className='mt-4 bg-gray-700 hover:bg-gray-600'
                    onClick={toggleTheme}
                >
                    {darkTheme ? 'Light Theme' : 'Dark Theme'}
                </Button>
            </div>
            <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={darkTheme ? "/images/cover-dark.png" : "/images/cover.png"}
                    alt="Feature 2"
                    layout="responsive"
                    width={1024}
                    height={768}
                    className="transition-transform duration-500 transform hover:scale-105"
                />
            </div>
        </section>
    );
} 