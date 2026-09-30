// One deck in a deck-list grid, laid out the way a video grid is: a media tile
// that carries the identity, then the title and a metadata line under it. There
// is no card border or shadow — the tile is the frame, and the text sits on the
// page — so a grid reads as rows of things to watch rather than a wall of boxes.
//
// Shared by every deck type and every language, so it reads everything it shows
// off the deck itself rather than off the list it happens to appear in: a
// vocabulary deck never claims to be an exam.
//
// The cover and the title are two separate links to the same details page, and
// the controls sit beside them as siblings. Nesting a button inside an anchor is
// invalid HTML and breaks keyboard navigation, so no control is ever a
// descendant of either link.
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaFileExport, FaTrash } from 'react-icons/fa6';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import AuthorAvatar from './AuthorAvatar';
import DeckCover from './DeckCover';
import { formatRelativeTime } from '~/utils/relativeTime';
import { useFavouritesStore } from '~/stores/deck/favourites.store';
import { useIsFavourite } from '~/hooks/useIsFavourite';
import { useLangText } from '~/hooks/useLangText';
import type { DeckData, DeckSource } from '~/types/deck';

const SOURCE_KEY: Record<DeckSource, string> = {
    official: 'deck.source.official',
    community: 'deck.source.community',
    local: 'deck.source.local',
    cloud: 'deck.source.cloud',
};

/** Sources the viewer may delete. `official` decks ship with the app and
 *  `community` ones belong to somebody else, so both are off-limits; an
 *  allowlist rather than a denylist so a new source has to opt in instead of
 *  silently becoming deletable. */
const OWNED_SOURCES: readonly DeckSource[] = ['local', 'cloud'];

/** Inverted chip, so it stays legible on top of any of the cover's tints. */
const OVERLAY_CHIP =
    'absolute rounded-sm bg-surface-foreground/85 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-surface backdrop-blur-sm';

/** Square button for the overlay controls, matching the chip's footprint. */
const ACTION_BUTTON =
    'flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-surface-foreground/85 text-surface backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground';

export default function DeckCard({
    to,
    deck,
    index,
    onExport,
    onDelete,
    onDownload,
}: {
    /** Details page for this deck; the deck id is appended. */
    to: string;
    deck: DeckData;
    /** Staggers the entrance so a grid fills in rather than popping. */
    index: number;
    /** Offered on locally-owned decks. */
    onExport?: () => void;
    /** Offered on anything the user can remove, i.e. not bundled or shared. */
    onDelete?: () => void;
    /** Only meaningful for cloud decks, which are fetched rather than owned. */
    onDownload?: () => void;
}) {
    const locale = useLangText();
    const { t, i18n } = useTranslation();

    const name = locale(deck.name);
    const isOwned = OWNED_SOURCES.includes(deck.source);
    const hasActions = Boolean(onExport || onDelete || onDownload);
    const author = deck.meta?.author;
    // Favourites are persisted, so `useIsFavourite` hides that from the server
    // render — see its note about hydration.
    const isFavourite = useIsFavourite(deck.id);
    const toggleFavourite = () => useFavouritesStore.getState().toggle(deck.id);
    const href = `${to}${deck.id}`;
    // A deck persisted before meta was required arrives with none, so the
    // metadata line falls back to the source label rather than going blank.
    const visibility = deck.meta?.visibility;
    // Bundled decks never change after release, so a relative "updated" time
    // would only age into a lie.
    const updatedAt = deck.source === 'official' ? undefined : deck.meta?.updatedAt;
    // Heart count, YouTube-style: the source's own total, plus this viewer's
    // like when the source has not already counted them. Nothing seeds `heart`
    // yet, so bundled and local decks show no number at all rather than a
    // fabricated one — a deck nobody else can like has no popularity to show.
    const sourceHearts = deck.meta?.heart ?? 0;
    const hearts = deck.meta?.isHeart ? sourceHearts : sourceHearts + (isFavourite ? 1 : 0);
    const showHearts = hearts > 0;
    const metadata = [
        author?.name ?? t(SOURCE_KEY[deck.source]),
        visibility ? t(`deck.visibility.${visibility}`) : undefined,
        updatedAt ? formatRelativeTime(updatedAt, i18n.language) : undefined,
    ].filter(Boolean);

    return (
        <motion.article
            className='group/card'
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, delay: Math.min(index, 11) * 0.04 }}
        >
            <Link
                to={href}
                tabIndex={-1}
                aria-hidden='true'
                className='block focus-visible:outline-2 focus-visible:outline-primary'
            >
                {/* The tile. `overflow-hidden` on the frame is what lets the
                    cover zoom on hover without spilling over the text. */}
                <div className='relative aspect-video overflow-hidden rounded-[10px] border border-line bg-surface'>
                    <div className='h-full w-full transition-transform duration-300 ease-out group-hover/card:scale-105'>
                        <DeckCover deck={deck} name={name} />
                    </div>

                    {/* The only thing allowed on the artwork: a deck's size is
                        part of its pitch, and this is where a video grid puts
                        its duration. */}
                    <span className={`${OVERLAY_CHIP} bottom-1.5 right-1.5`}>
                        {t('deck.itemCount', { count: deck.contentIds.length })}
                    </span>
                </div>
            </Link>

            <div className='mt-3 flex items-start gap-3'>
                {/* The title block is the card's real link — it carries the
                    accessible name, and the cover above is a duplicate target
                    hidden from assistive tech and the tab order. */}
                <Link
                    to={href}
                    aria-label={t('deck.openAria', { name })}
                    className='flex min-w-0 flex-1 gap-3 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4'
                >
                    {author && <AuthorAvatar author={author} size='md' />}
                    <div className='min-w-0 flex-1'>
                        <h3 className='line-clamp-2 text-sm font-semibold leading-snug text-surface-foreground'>
                            {name}
                        </h3>
                        <p className='mt-1 line-clamp-1 text-xs text-surface-muted'>
                            {metadata.join(' · ')}
                        </p>

                        {deck.tags.length > 0 && (
                            <ul className='mt-1.5 flex flex-wrap gap-1'>
                                {deck.tags.slice(0, 3).map((tag) => (
                                    <li
                                        key={tag}
                                        className='rounded-sm border border-line px-1.5 py-px font-mono text-[10px] uppercase tracking-[0.1em] text-surface-muted'
                                    >
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Link>

                {/* Controls sit beside the title, never over the artwork. */}
                <div className='flex shrink-0 items-center gap-0.5'>
                    <button
                        type='button'
                        onClick={toggleFavourite}
                        aria-pressed={isFavourite}
                        title={t(isFavourite ? 'deck.unfavourite' : 'deck.favourite')}
                        aria-label={t(isFavourite ? 'deck.unfavourite' : 'deck.favourite')}
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm transition-colors ${
                            isFavourite
                                ? 'text-error'
                                : 'text-surface-muted hover:bg-surface-overlay hover:text-error'
                        }`}
                    >
                        {isFavourite ? (
                            <FaHeart className='h-4 w-4' />
                        ) : (
                            <FaRegHeart className='h-4 w-4' />
                        )}
                    </button>

                    {/* The count sits outside the button: a screen reader reads
                        the button as "Add to favourites" either way, and a live
                        number inside it would be announced as part of the
                        label. */}
                    {showHearts && (
                        <span
                            className={`-ml-1 font-mono text-xs tabular-nums ${
                                isFavourite ? 'text-error' : 'text-surface-muted'
                            }`}
                        >
                            {hearts}
                        </span>
                    )}

                    {/* Management actions stay hidden until the card is hovered
                        or one of them takes focus, so they do not compete with
                        the favourite. */}
                    {hasActions && (
                        <div className='flex items-center gap-0.5 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover/card:opacity-100'>
                            {onExport && deck.source === 'local' && (
                                <button
                                    type='button'
                                    title={t('deck.export')}
                                    aria-label={t('deck.exportAria')}
                                    onClick={onExport}
                                    className={ACTION_BUTTON}
                                >
                                    <FaFileExport className='h-3.5 w-3.5' />
                                </button>
                            )}
                            {onDownload && deck.source === 'cloud' && (
                                <button
                                    type='button'
                                    title={t('deck.download')}
                                    aria-label={t('deck.downloadAria')}
                                    onClick={onDownload}
                                    className={ACTION_BUTTON}
                                >
                                    <FaDownload className='h-3.5 w-3.5' />
                                </button>
                            )}
                            {onDelete && isOwned && (
                                <button
                                    type='button'
                                    title={t('deck.delete')}
                                    aria-label={t('deck.deleteAria')}
                                    onClick={onDelete}
                                    className={`${ACTION_BUTTON} hover:bg-error hover:text-error-foreground`}
                                >
                                    <FaTrash className='h-3.5 w-3.5' />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
