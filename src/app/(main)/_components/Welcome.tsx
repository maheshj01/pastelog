"use client";
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
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTagLine((prev) => (prev + 1) % tagLineWords.length);
        }, 2500); // Change word every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const saveLocally = async () => {
        const logService = new LogService();
        const log = await logService.fetchLogById('getting-started');
        if (log) {
            logService.saveLogToLocal(log);
        }
    }

    const handleGetStarted = async () => {
        setLoading(true); // Set loading state to true immediately

        try {
            await new Promise<void>(resolve => {
                setTimeout(() => {
                    console.log('Get Started');
                    setLoading(false); // Set loading state to false after timeout
                    router.push('/logs');
                    resolve(); // Resolve the promise after timeout completes
                }, 2000);
            });

            // Perform actions that should happen while waiting for timeout
            localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, 'false');
            saveLocally();
        } catch (error) {
            console.error('Error in handleGetStarted:', error);
            setLoading(false); // Ensure loading state is false on error
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
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
            <div className="mt-8 w-full max-w-3xl relative overflow-hidden rounded-lg shadow-lg">
                <Image
                    src="/images/cover.png"
                    alt="Pastelog"
                    layout="responsive"
                    width={1024}
                    height={768}
                    className="transition-transform duration-500 transform hover:scale-105"
                />
            </div>
        </div>
    );
}
