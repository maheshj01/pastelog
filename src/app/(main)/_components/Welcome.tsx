"use client";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSettings from "../_hooks/useSettings";
import Analytics from "../_services/Analytics";
import LogService from '../_services/logService';
import GradientText from './GradientText';
import { Button } from './button';
import { Constants } from "@/app/constants";
export default function Welcome() {
    const tagLineWords = ['Easy', 'Fast', 'Powerful'];
    const tagLineDescription = ['Easy to use', 'Fast to load', 'Powerful features'];
    const [currentTagLine, setCurrentTagLine] = useState(0);
    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState<number | null>(null);
    const [darkTheme, setDarkTheme] = useState(false); // State for dark theme
    const router = useRouter();
    const tagline = 'Publish Rich Text Notes, and access them with a unique link.';
    const { settings, toggleNewUser, setNewUser } = useSettings();

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
            }
        }
    }

    const handleGetStarted = async () => {
        setLoading(true); // Set loading state to true immediately
        saveLocally(Constants.publicLogIds);
        setNewUser(false);
        try {
            await new Promise<void>(resolve => {
                setTimeout(() => {
                    setLoading(false);
                    router.push('/logs');
                    resolve();
                }, 2500);
            });
            Analytics.logEvent('get_started', { action: 'click' });
        } catch (error) {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        setDarkTheme(prev => !prev); // Toggle between dark and light themes
    };

    const scrollToSection = (sectionIndex: number) => {
        setIndex(sectionIndex - 1);
        const sections = document.querySelectorAll('section');
        if (sections[sectionIndex!]) {
            sections[sectionIndex!].scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sectionTitles = [
        "Introduction",
        "Beautiful Markdown",
        "Powered By Gemini",
        "Keyboard Shortcuts",
        "Create and Share",
        "Dark Mode",
        "Save Locally"
    ];

    return (
        <div className={`min-h-screen ${darkTheme ? 'bg-gray-800' : 'bg-gray-900'} text-white`}>
            <div className={`${darkTheme ? 'bg-gray-800' : 'bg-gray-900'} fixed top-0 left-0 right-0 flex justify-center py-2 px-6 z-50`}>
                <div className="fixed top-0 left-0 py-6 px-6 h-32 w-32 z-200">
                    <Image
                        src={"/images/frame.png"}
                        alt="Logo"
                        width={70}
                        height={70}
                        className="transition-transform duration-500 transform hover:scale-105"
                    />
                </div>
                <div className={`flex flex-wrap items-center justify-center gap-2 mb-2 rounded-3xl p-4 border-2`}>
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
            {/* Section 1: Introduction */}
            <section className="flex flex-col items-center justify-center min-h-screen">
                <GradientText className='tagline' text={tagLineWords[currentTagLine]} gradientColors={['#FF0080', '#7928CA']} fontSize="5rem" />
                <p className="text-2xl mb-2 text-center">
                    Welcome to Pastelog!
                </p>
                <p className="text-lg mb-8 text-center">
                    {tagline}</p>
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
                <p className="text-center mt-32 mb-4">Show Your support on ProductHunt</p>
                <a href="https://www.producthunt.com/posts/pastelog?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pastelog" target="_blank">
                    <Image
                        width={250} height={54}
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=466669&theme=light" alt="Pastelog - Create&#0032;stunning&#0032;rich&#0032;text&#0032;notes&#0032;in&#0032;minutes | Product Hunt" />
                </a>
                <div className='animate-pulse fixed bottom-10 text-white cursor-pointer'>
                    <ChevronDownIcon
                        color="white"
                        onClick={scrollByScreenHeight}
                        className="text-white size-12" />
                </div>
            </section>

            {/* Section 2: Feature 1 */}
            <section className="flex flex-col items-center justify-center min-h-screen pt-8">
                <p className="text-3xl mt-8 mb-4 text-center">
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

            <section className="flex flex-col items-center justify-center min-h-screen pt-8">
                <p className="text-3xl mt-8 mb-4 text-center">
                    Powered By Gemini
                </p>
                <p className="text-center">Pastelog comes with Gemini Integrated to help you along the way.</p>
                <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                    {/* video without any controls on loop */}
                    <video
                        src="https://github.com/user-attachments/assets/a7eb8978-95cd-4d21-8045-34e9ceb027b4"
                        autoPlay
                        loop
                        muted
                        className="w-full h-full rounded-lg shadow-lg"
                    />

                </div>
            </section>

            {/* Section 3: Feature 2 */}
            <section className="flex flex-col items-center justify-center min-h-screen pt-8">
                <p className="text-3xl mt-8 mb-4 text-center">
                    Keyboard Shortcuts for Faster Editing
                </p>
                <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                    {/* video without any controls on loop */}
                    <video
                        src="https://github.com/maheshmnj/pastelog/assets/31410839/b5e91e3e-6f7e-43cd-8b0f-f8c769dabfe1"
                        autoPlay
                        loop
                        muted
                        className="w-full h-full rounded-lg shadow-lg"
                    />

                </div>
            </section>
            {/* Section 4: Feature 3 */}
            <section className="flex flex-col items-center justify-center min-h-screen pt-8">
                <p className="text-3xl mt-8 mb-4 text-center">
                    Create and Share Logs
                </p>
                <p>Create stunning logs in minutes with markdown support and share with anyone using a unique URL</p>
                <p className="text-center"> Supports exporting logs in Image or Text format</p>
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

            {/* Section 5: Feature 4 */}
            <section className="flex flex-col items-center justify-center min-h-screen pt-8">
                <div className="flex flex-col items-center justify-between w-full max-w-3xl">
                    <p className="text-3xl my-8 text-center">
                        {/* dark mode */}
                        Dark Mode
                    </p>
                    <p className="text-center">Toggle between dark and light themes</p>
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

            {/* Section 6: Feature 5 */}
            <section className="flex flex-col items-center justify-center min-h-screen pt-8">
                <p className="text-3xl mt-8 mb-4 text-center">
                    Save Logs Locally
                </p>
                <p className="text-center">Your logs are saved locally and can be accessed in the sidebar for quick access.</p>
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
        </div >
    );
}
