import { useEffect, type RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    onOutside: () => void,
    enabled = true,
) {
    useEffect(() => {
        if (!enabled) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [enabled, onOutside, ref]);
}
