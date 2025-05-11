"use client";
import { Constants } from "@/app/constants";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSettings from "../_hooks/useSettings";
import Analytics from "../_services/Analytics";
import LogService from '../_services/logService';
import { BeautifulMarkdown } from './features/BeautifulMarkdown';
import { CreateAndShare } from './features/CreateAndShare';
import { DarkMode } from './features/DarkMode';
import { GeminiPowered } from './features/GeminiPowered';
import { Introduction } from './features/Introduction';
import { KeyboardShortcuts } from './features/KeyboardShortcuts';
import { SaveLocally } from './features/SaveLocally';
import { Navigation } from './Navigation';

export default function Welcome() {
    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState<number | null>(null);
    const [darkTheme, setDarkTheme] = useState(false);
    const router = useRouter();
    const { setNewUser } = useSettings();

    const scrollByScreenHeight = () => {
        const currentScrollY = window.scrollY;
        const nextScrollY = currentScrollY + window.innerHeight;
        window.scrollTo({
            top: nextScrollY,
            behavior: 'smooth'
        });
    };

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
                }, 1500);
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

    return (
        <div className={`min-h-screen ${darkTheme ? 'bg-gray-800' : 'bg-gray-900'} text-white`}>
            <Navigation
                darkTheme={darkTheme}
                index={index}
                scrollToSection={scrollToSection}
            />
            <Introduction
                loading={loading}
                handleGetStarted={handleGetStarted}
                scrollByScreenHeight={scrollByScreenHeight}
            />

            <BeautifulMarkdown />
            <GeminiPowered />
            <KeyboardShortcuts />
            <CreateAndShare />
            <DarkMode darkTheme={darkTheme} toggleTheme={toggleTheme} />
            <SaveLocally />
        </div>
    );
}
