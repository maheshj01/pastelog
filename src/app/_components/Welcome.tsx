"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../_components/button';
import GradientText from './GradientText';

export default function Welcome() {
    const tagLineWords = ['Easy', 'Fast', 'Powerful'];
    const tagLineDescription = ['Easy to use', 'Fast to load', 'Powerful features'];
    const [currentTagLine, setCurrentTagLine] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTagLine((prev) => (prev + 1) % tagLineWords.length);
        }, 2500); // Change word every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleGetStarted = () => {
        localStorage.setItem(`${process.env.NEXT_PUBLIC_NEW_USER_VISITED}`, 'false');
        router.push('/logs');
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
                size={'lg'}
                onClick={handleGetStarted}>
                Get Started
            </Button>
        </div>
    );
}