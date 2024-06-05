// app/components/ThemeSwitcher.tsx
"use client";

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div>
            <Button isIconOnly aria-label="Light Mode" className='bg-transparent rounded-full p-2 dark:text-white'
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                size='lg'>
                {theme === 'dark' ? <SunIcon className='text-black size-12 dark:text-white' /> : <MoonIcon className='size-12 text-black dark:text-white' />}
            </Button>
        </div>
    )
};

