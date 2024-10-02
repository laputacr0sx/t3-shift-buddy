import { useState } from 'react';
import { useTheme } from 'next-themes';

import { Moon, Star, Sun } from 'lucide-react';
import { Toggle } from '~/components/ui/toggle';

export function ModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const { setTheme } = useTheme();

    return (
        <Toggle
            variant="default"
            size={'sm'}
            onClick={() => {
                setIsDarkMode(!isDarkMode);
                setTheme(isDarkMode ? 'dark' : 'light');
            }}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Toggle>
    );
}
