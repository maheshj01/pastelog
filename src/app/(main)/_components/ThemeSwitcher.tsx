// app/components/ThemeSwitcher.tsx
'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Analytics from '../_services/Analytics';
import IconButton from './IconButton';

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div>
            <IconButton
                tooltipPlacement='bottom-end'
                ariaLabel={
                    theme === 'dark' ? 'Light Mode' : 'Dark Mode'

                } onClick={() => {
                    setTheme(theme == Theme.DARK ? 'light' : 'dark');
                    Analytics.logThemeChange(theme === 'dark' ? 'light' : 'dark');
                }}>
                {theme === 'dark' ? <SunIcon className='text-black size-7 dark:text-white' /> : <MoonIcon className='size-7 text-black dark:text-white' />}
            </IconButton>
        </div>
    )
};

