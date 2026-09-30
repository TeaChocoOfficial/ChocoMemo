// Stand-in mark for an author with no avatar: the app logo for the bundled
// decks, initials for everyone else. Shared by the byline and the card, which
// want it at different sizes.
import { getInitials } from '~/components/layout/navbar/utils';
import { APP_AUTHOR_ID, GUEST_AUTHOR_ID } from '~/constants/deckAuthors';
import type { DeckAuthor } from '~/types/deck';

/** Public profile of a deck's author, or `undefined` when there is no person
 *  to send them to: a bundled deck, a guest deck, or an author recorded before
 *  the field existed. */
export function authorProfile(author: DeckAuthor | undefined): string | undefined {
    if (!author || !author.nameTag) return undefined;
    if (author.userId === APP_AUTHOR_ID || author.userId === GUEST_AUTHOR_ID) return undefined;
    return `/profile/${author.nameTag}`;
}

export default function AuthorAvatar({
    author,
    size = 'sm',
}: {
    author: DeckAuthor;
    size?: 'sm' | 'md';
}) {
    const dimensions = size === 'md' ? 'h-9 w-9 text-xs' : 'h-6 w-6 text-[10px]';

    if (author.avatar) {
        return (
            <img
                src={author.avatar}
                alt=''
                className={`${dimensions} shrink-0 rounded-full border border-line object-cover`}
            />
        );
    }

    return (
        <span
            aria-hidden='true'
            className={`${dimensions} flex shrink-0 items-center justify-center rounded-full border border-line bg-surface-overlay font-mono font-bold text-surface-subtle`}
        >
            {getInitials(author.name)}
        </span>
    );
}
