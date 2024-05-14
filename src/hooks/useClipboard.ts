import { useEffect, useState } from 'react';

export function useClipboard() {
    const [clipboard, setClipboard] = useState<Clipboard | null>(null);

    useEffect(() => {
        if (!navigator.clipboard) {
            setClipboard(null);
        }
        setClipboard(navigator.clipboard);
    }, []);

    return clipboard;
}
