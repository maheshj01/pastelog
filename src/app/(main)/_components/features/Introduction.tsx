import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GradientText from '../GradientText';
import { Button } from '../button';

interface IntroductionProps {
    loading: boolean;
    handleGetStarted: () => void;
    scrollByScreenHeight: () => void;
}

export function Introduction({
    loading,
    handleGetStarted,
    scrollByScreenHeight
}: IntroductionProps) {
    const tagLineWords = ['Easy', 'Fast', 'Powerful'];
    const [currentTagLine, setCurrentTagLine] = useState(0);
    const tagline = 'Publish Rich Text Notes, and access them with a unique link.';

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTagLine((prev) => (prev + 1) % tagLineWords.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-2xl text-center">
                Welcome to Pastelog!
            </p>
            <div className="h-24"> {/* Fixed height container to prevent layout shift */}
                <GradientText
                    className='tagline'
                    text={tagLineWords[currentTagLine]}
                    gradientColors={['#FF0080', '#7928CA']}
                    fontSize="5rem"
                />
            </div>
            <p className="text-lg my-8 text-center">{tagline}</p>
            <Button
                className='bg-gradient-to-br from-indigo-500  to-indigo-700'
                size={'lg'}
                onClick={handleGetStarted}
                disabled={loading}
            >
                {loading ? (
                    <div className="loader mx-6 py-1" />
                ) : 'Get Started'}
            </Button>
            <p className="text-center mt-32 mb-4">Show Your support on ProductHunt</p>
            <a href="https://www.producthunt.com/posts/pastelog?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-pastelog" target="_blank">
                <Image
                    width={250} height={54}
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=466669&theme=light"
                    alt="Pastelog - Create&#0032;stunning&#0032;rich&#0032;text&#0032;notes&#0032;in&#0032;minutes | Product Hunt"
                />
            </a>
            <div className='animate-pulse fixed bottom-10 text-white cursor-pointer'>
                <ChevronDownIcon
                    color="white"
                    onClick={scrollByScreenHeight}
                    className="text-white size-12"
                />
            </div>
        </section>
    );
} 