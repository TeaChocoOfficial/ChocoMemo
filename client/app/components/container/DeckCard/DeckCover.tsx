// The 16:9 tile that stands in for a deck's artwork.
//
// Decks have an optional `image` but nothing sets one yet, so a deck without
// artwork still needs something worth looking at. The fallback is typographic —
// a tinted sheet with the deck's initial — picked by hashing the deck id so a
// deck keeps the same colour for the life of the app and the server and client
// agree on which one without shipping a lookup table.
import type { DeckData } from '~/types/deck';

/** Theme tokens only: a cover has to survive every theme, and a hardcoded hue
 *  would not. */
const TINTS = [
    { sheet: 'bg-primary-subtle', ink: 'text-primary-emphasis' },
    { sheet: 'bg-secondary-subtle', ink: 'text-secondary-emphasis' },
    { sheet: 'bg-info-subtle', ink: 'text-info-emphasis' },
    { sheet: 'bg-success-subtle', ink: 'text-success-emphasis' },
    { sheet: 'bg-warning-subtle', ink: 'text-warning-emphasis' },
    { sheet: 'bg-surface-sunken', ink: 'text-secondary-emphasis' },
] as const;

/** First letter of the deck name, which is what the tile is built around. */
function monogram(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?';
}

/** Stable across renders and across the server/client boundary, unlike
 *  `Math.random()`. */
function hash(id: string): number {
    let value = 0;
    for (let i = 0; i < id.length; i++) {
        value = (value * 31 + id.charCodeAt(i)) >>> 0;
    }
    return value;
}

export default function DeckCover({
    deck,
    name,
    className = '',
}: {
    deck: DeckData;
    /** Resolved deck name, so the monogram is readable in the viewer's
     *  language rather than whatever the raw field happens to hold. */
    name: string;
    className?: string;
}) {
    if (deck.image) {
        return (
            <img
                src={deck.image}
                alt=''
                className={`h-full w-full object-cover ${className}`}
            />
        );
    }

    const tint = TINTS[hash(deck.id) % TINTS.length];

    return (
        <div
            aria-hidden='true'
            className={`relative flex h-full w-full items-center justify-center overflow-hidden ${tint.sheet} ${className}`}
        >
            {/* The dot grid from the page header, at a larger pitch. It gives a
                flat tint some texture without competing with the monogram. */}
            <div className='absolute inset-0 bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] opacity-50' />
            <span
                className={`relative font-sans text-6xl font-black leading-none tracking-tight opacity-90 ${tint.ink}`}
            >
                {monogram(name)}
            </span>
        </div>
    );
}
