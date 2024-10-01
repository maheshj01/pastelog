import { useEffect, useState } from 'react';

function useSmallScreen(breakpoint: number = 640) {
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if window is available (browser environment)
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Set initial state
        setIsSmallScreen(mediaQuery.matches);

        // Define the event handler
        const handleResize = (e: MediaQueryListEvent) => {
            setIsSmallScreen(e.matches);
        };

        // Add the event listener
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup the listener on unmount
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, [breakpoint]);

    // Handle the case when `isSmallScreen` is null, which happens on the server
    return isSmallScreen;
}

export default useSmallScreen;