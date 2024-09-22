import { useEffect, useState } from 'react';

// Singleton state for tracking screen size
let isSmallScreenSingleton: boolean | null = null;
let listeners: ((isSmall: boolean) => void)[] = [];

function handleResize({ matches }: MediaQueryListEvent) {
    const isSmall = matches;
    if (isSmallScreenSingleton !== isSmall) {
        isSmallScreenSingleton = isSmall;
        listeners.forEach(listener => listener(isSmall));
    }
}

function useSmallScreen(breakpoint: number = 640) {
    const [isSmallScreen, setIsSmallScreen] = useState(() => isSmallScreenSingleton ?? window.matchMedia(`(max-width: ${breakpoint}px)`).matches);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        setIsSmallScreen(mediaQuery.matches);
        isSmallScreenSingleton = mediaQuery.matches;

        const listener = (isSmall: boolean) => setIsSmallScreen(isSmall);
        listeners.push(listener);

        // Add the global resize handler only if it's not already set
        if (listeners.length === 1) {
            mediaQuery.addEventListener('change', handleResize);
        }

        return () => {
            listeners = listeners.filter(l => l !== listener);

            if (listeners.length === 0) {
                mediaQuery.removeEventListener('change', handleResize);
            }
        };
    }, [breakpoint]);

    return isSmallScreen;
}

export default useSmallScreen;
