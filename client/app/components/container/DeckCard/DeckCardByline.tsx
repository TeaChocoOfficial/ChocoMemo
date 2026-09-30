// Who made a deck, on one line: avatar, name, and how long ago it was touched.
// Split out of `DeckCard` because it is the one part of the card that has to
// cope with a half-filled author — deck meta predates the required field, so a
// stored deck can arrive with no avatar, or with none of the author at all.
//
// The name links through to the author's profile. That only works here and not
// on the card tile: in the grid the whole tile is one link to the deck, and a
// link inside a link is invalid HTML, so the card leaves the author as plain
// text and sends the viewer to the details page to reach the profile.
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { formatRelativeTime } from '~/utils/relativeTime';
import AuthorAvatar, { authorProfile } from './AuthorAvatar';
import type { DeckAuthor } from '~/types/deck';

export default function DeckCardByline({
    author,
    updatedAt,
    /** Shown instead of the byline for a deck with no author recorded. */
    fallback,
}: {
    author?: DeckAuthor;
    updatedAt?: string;
    fallback: string;
}) {
    const { t, i18n } = useTranslation();

    if (!author) return <p className='text-xs text-surface-muted'>{fallback}</p>;

    const profile = authorProfile(author);
    const name = t('deck.byAuthor', { author: author.name });

    return (
        <div className='flex items-center gap-2 text-xs text-surface-muted'>
            <AuthorAvatar author={author} />
            {profile ? (
                <Link
                    to={profile}
                    aria-label={t('deck.viewAuthor', { author: author.name })}
                    className='truncate font-medium text-surface-subtle transition-colors hover:text-primary hover:underline'
                >
                    {name}
                </Link>
            ) : (
                <span className='truncate font-medium text-surface-subtle'>{name}</span>
            )}
            {updatedAt && (
                <>
                    <span aria-hidden='true'>·</span>
                    <time dateTime={updatedAt} className='shrink-0'>
                        {formatRelativeTime(updatedAt, i18n.language)}
                    </time>
                </>
            )}
        </div>
    );
}
