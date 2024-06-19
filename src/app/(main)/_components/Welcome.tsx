"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogService from '../_services/logService';
import GradientText from './GradientText';
import { Button } from './button';

export default function Welcome() {
    const tagLineWords = ['Easy', 'Fast', 'Powerful'];
    const tagLineDescription = ['Easy to use', 'Fast to load', 'Powerful features'];
    const [currentTagLine, setCurrentTagLine] = useState(0);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

        const timeoutPromise = new Promise<void>(resolve => {
            setTimeout(() => {
                console.log('Get Started');
                setLoading(false); // Set loading state to false after timeout
                router.push('/logs');
                resolve(); // Resolve the promise after timeout completes
            }, 2000);
        });

        // Create a promise that resolves when timeoutPromise resolves
        const result = await Promise.race([
            timeoutPromise,
            new Promise<void>(resolve => {
                console.log('loading');
                // Here you can perform any actions that should happen after the timeout
                localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, 'false');
                saveLocally();
                resolve();
            })
        ]);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            {/* bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400"> */}
            <GradientText className='tagline' text={tagLineWords[currentTagLine]} gradientColors={['#FF0080', '#7928CA']} fontSize="5rem" />
            <p className="text-2xl mb-16 text-gray-300">
                <span>Welcome to Pastelog!</span>
                { }
            </p>
            <Button
                className='bg-gradient-to-br from-indigo-500  to-indigo-700'
                size={'lg'}
                onClick={handleGetStarted}>
                {loading ? (
                    <div className="loader mx-6 py-1" />
                ) : "Get Started"}
            </Button>
        </div>
    );
}