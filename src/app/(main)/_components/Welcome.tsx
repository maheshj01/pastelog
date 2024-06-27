"use client";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogService from '../_services/logService';
import GradientText from './GradientText';
import { Button } from './button';
export default function Welcome() {
    const tagLineWords = ['Easy', 'Fast', 'Powerful'];
    const tagLineDescription = ['Easy to use', 'Fast to load', 'Powerful features'];
    const [currentTagLine, setCurrentTagLine] = useState(0);
    const [loading, setLoading] = useState(false);
    const [darkTheme, setDarkTheme] = useState(false); // State for dark theme
    const router = useRouter();
    const scrollByScreenHeight = () => {
        const currentScrollY = window.scrollY;
        const nextScrollY = currentScrollY + window.innerHeight;
        window.scrollTo({
            top: nextScrollY,
            behavior: 'smooth'
        });
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTagLine((prev) => (prev + 1) % tagLineWords.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const saveLocally = async (documentIds: string[]) => {
        const logService = new LogService();
        for (const id of documentIds) {
            try {
                const log = await logService.fetchLogById(id);
                if (log) {
                    await logService.saveLogToLocal(log);
                } else {
                    console.warn(`Document with ID: ${id} not found`);
                }
            } catch (error) {
                console.error(`Error saving document with ID: ${id}`, error);
            }
        }

        console.log('Finished saving documents locally');
    }

    const handleGetStarted = async () => {
        setLoading(true); // Set loading state to true immediately
        saveLocally(['getting-started', 'shortcuts']);
        localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, 'false');
        try {
            await new Promise<void>(resolve => {
                setTimeout(() => {
                    setLoading(false);
                    router.push('/logs');
                    resolve();
                }, 2500);
            });
        } catch (error) {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        setDarkTheme(prev => !prev); // Toggle between dark and light themes
    };

    return (
        <div className={`min-h-screen ${darkTheme ? 'bg-gray-800' : 'bg-gray-900'} text-white`}>
            {/* Section 1: Introduction */}
            <section className="flex flex-col items-center justify-center min-h-screen">
                <GradientText className='tagline' text={tagLineWords[currentTagLine]} gradientColors={['#FF0080', '#7928CA']} fontSize="5rem" />
                <p className="text-2xl mb-16">
                    Welcome to Pastelog!
                </p>
                <Button
                    className='bg-gradient-to-br from-indigo-500  to-indigo-700'
                    size={'lg'}
                    onClick={handleGetStarted}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="loader mx-6 py-1" />
                    ) : "Get Started"}
                </Button>

                <div className='animate-pulse fixed bottom-10 text-white cursor-pointer'>
                    <ChevronDownIcon
                        color="white"
                        onClick={scrollByScreenHeight}
                        className="text-white size-12" />
                </div>
            </section>

            {/* Section 2: Feature 1 */}
            <section className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-3xl my-8">
                    Beautiful Markdown with Syntax Highlighting
                </p>
                <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={"/images/cover.png"}
                        alt="Feature 1"
                        layout="responsive"
                        width={1024}
                        height={768}
                        className="transition-transform duration-500 transform hover:scale-105"
                    />
                </div>
            </section>

            <section className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-3xl my-8">
                    Create and Share Logs
                </p>
                <p>Create stunning logs in minutes with markdown support and share with anyone using a unique URL</p>
                <p> Supports exporting logs in Image or Text format</p>
                <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                    {/* video without any controls on loop */}
                    <video
                        src="https://github.com/maheshmnj/pastelog/assets/31410839/c4e4469b-3acb-45e1-a258-0d8593d1e831"
                        autoPlay
                        loop
                        muted
                        className="w-full h-full rounded-lg shadow-lg"
                    />

                </div>
            </section>

            {/* Section 3: Feature 2 */}
            <section className="flex flex-col items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-between w-full max-w-3xl">
                    <p className="text-3xl my-8">
                        {/* dark mode */}
                        Dark Mode
                    </p>
                    <p>Toggle between dark and light themes</p>
                    <Button
                        className='mt-4 bg-gray-700 hover:bg-gray-600'
                        onClick={toggleTheme}
                    >
                        {darkTheme ? 'Light Theme' : '  Dark Theme'}
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

            {/* Section 4: Feature 3 */}
            <section className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-3xl my-8">
                    Save Logs Locally
                </p>
                <p>Your logs are saved locally for easy access</p>
                <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={"/images/local.png"}
                        alt="Feature 3"
                        layout="responsive"
                        width={1024}
                        height={768}
                        className="transition-transform duration-500 transform hover:scale-105"
                    />
                </div>
            </section>

            {/* Additional sections for more features */}
        </div>
    );
}
