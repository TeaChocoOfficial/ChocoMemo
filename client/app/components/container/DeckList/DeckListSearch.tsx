// -Path: 'client/app/components/container/DeckList/DeckListSearch.tsx'
// The search box for the deck list.
//
// This is the one input that writes with `replace` rather than `push` — every
// keystroke would flood the browser history if we pushed it, so Back would
// step through characters instead of leaving the search. The URL hook already
// treats `setSearch` as a replace; this component is the labelled surface for
// it and offers a single "clear" action that returns to the previous view.
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';

export default function DeckListSearch({
    value,
    onChange,
    onClear,
}: {
    /** The trimmed query in the URL. */
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

    // Pressing Escape clears the search *and* blurs the input so the keyboard
    // viewer does not stay trapped in the box. If the box is already empty it
    // still blurs, which is the expected "get out of here" behaviour.
    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            if (value) {
                onClear();
            }
            input.blur();
        };

        input.addEventListener('keydown', onKeyDown);
        return () => input.removeEventListener('keydown', onKeyDown);
    }, [value, onClear]);

    return (
        <div className='relative'>
            <FaMagnifyingGlass className='pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
            <input
                ref={inputRef}
                type='search'
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={t('deck.searchAria')}
                placeholder={t('deck.search')}
                className='w-full border-b border-line-strong bg-transparent py-2 pl-6 pr-8 font-mono text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
            />
            {value && (
                <button
                    type='button'
                    onClick={onClear}
                    className='absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm p-1 text-surface-muted transition-colors hover:text-surface-foreground'
                    aria-label={t('deck.searchClear')}
                >
                    <FaXmark className='h-4 w-4' />
                </button>
            )}
        </div>
    );
}