// Details page for any deck, reached from every deck-list grid.
//
// It exists because the list cards are for choosing, not for starting: one URL
// per deck keeps the card link honest for all four deck types and for English,
// which has list pages but no session routes of its own yet.
import { useNavigate } from 'react-router';
import { Link, localizePath } from '~/i18n/routing';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Badge from '~/components/custom/Badge';
import Section from '~/components/custom/Section';
import DeckCardByline from '~/components/container/DeckCard/DeckCardByline';
import { localDecks, useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import { officialDecks } from '~/data/japanese/officialDecks';
import { useDeckListCloudStore } from '~/stores/deck/deckListCloud.store';
import { useDeckListCommunityStore } from '~/stores/deck/deckListCommunity.store';
import { useLangText } from '~/hooks/useLangText';
import { formatRelativeTime } from '~/utils/relativeTime';
import type { Lang } from '~/i18n/locales';
import type { DeckData, DeckLists, DeckType } from '~/types/deck';
import { Languages } from '~/data/language';

/** Which tracks have a session page per deck type. The route segment is the
 *  deck type, so this is really a list of which tracks are wired up.
 *  @todo Drop an entry as each track gains its session routes. */
const SESSION_TYPES: Partial<Record<Languages, readonly DeckType[]>> = {
    [Languages.ja]: ['vocab', 'render', 'exam', 'review'],
};

/** Where "Start" goes, or `undefined` when the track has no session yet —
 *  an honest notice beats a button into a 404. */
function sessionPath(deck: DeckData, language: Languages): string | undefined {
    if (!SESSION_TYPES[language]?.includes(deck.type)) return undefined;
    return `/${language}/${deck.type}/${deck.id}`;
}

/** A deck from any source, or `undefined` if no source holds that id. */
function findDeck(
    deckId: string,
    language: Languages,
    cloudLists: DeckLists,
    communityLists: DeckLists,
): DeckData | undefined {
    const sources: DeckData[][] = [
        officialDecks(language),
        localDecks(language),
        cloudLists[language] ?? [],
        communityLists[language] ?? [],
    ];
    return sources.flat().find((deck) => deck.id === deckId);
}

export default function DeckDetailsPage({
    deckId,
    language,
}: {
    deckId: string;
    language: Languages;
}) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const locale = useLangText();

    // Subscribing to the local store is what makes the page re-render once
    // storage has rehydrated, which is when a local deck first appears.
    useDeckListLocalStore();
    const cloudLists = useDeckListCloudStore((state) => state.deckLists);
    const communityLists = useDeckListCommunityStore((state) => state.deckLists);

    const deck = findDeck(deckId, language, cloudLists, communityLists);

    // Where to send the viewer when there is no history to unwind — a shared
    // link opened in a fresh tab, say. An unknown deck has no type to name a
    // list, so a miss falls back to the track hub rather than guessing one.
    const fallbackPath = deck ? `/${language}/${deck.type}` : `/${language}`;

    /**
     * Goes back in history rather than to a fixed list, so a deck opened from
     * anywhere — a list, a search, another deck — returns to where it was
     * opened from instead of always to one canonical list.
     *
     * Read at click time, not at render: the history length is the same on the
     * server and the client, so asking during render would pick a branch the
     * client then contradicts.
     */
    const goBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate(localizePath(i18n.language as Lang, fallbackPath));
    };

    if (!deck) {
        return (
            <Section>
                <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full py-20 text-center'>
                    <p className='text-sm text-surface-muted'>{t('deck.details.notFound')}</p>
                    <button
                        type='button'
                        onClick={goBack}
                        className='mt-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary'
                    >
                        <FaArrowLeft className='h-3.5 w-3.5' />
                        {t('deck.details.back')}
                    </button>
                </div>
            </Section>
        );
    }

    const start = sessionPath(deck, language);
    const name = locale(deck.name);
    const visibility = deck.meta?.visibility;

    return (
        <Section>
            <div className='mx-auto max-w-4xl px-4 sm:px-6 w-full'>
                <button
                    type='button'
                    onClick={goBack}
                    className='inline-flex cursor-pointer items-center gap-2 mb-6 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                >
                    <FaArrowLeft className='h-3.5 w-3.5' />
                    {t('deck.details.back')}
                </button>

                <div className='relative overflow-hidden rounded-sm border border-line bg-surface shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]'>
                    <div
                        aria-hidden='true'
                        className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-size-[18px_18px] opacity-40'
                    />

                    <div className='relative px-5 py-8 sm:px-8 sm:py-10'>
                        <p className='font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-primary'>
                            {t(`deck.type.${deck.type}`)}
                        </p>
                        <h1 className='mt-2 font-sans text-3xl font-black tracking-tight text-surface-foreground sm:text-4xl'>
                            {name}
                        </h1>

                        <div className='mt-4 flex flex-wrap items-center gap-3'>
                            <DeckCardByline
                                author={deck.meta?.author}
                                // A bundled deck is frozen at release, so its
                                // timestamp would only drift further from the
                                // truth the longer the app is installed.
                                updatedAt={
                                    deck.source === 'official'
                                        ? undefined
                                        : deck.meta?.updatedAt
                                }
                                fallback={t(`deck.source.${deck.source}`)}
                            />
                            {visibility && (
                                <Badge variant={visibility === 'public' ? 'info' : 'default'}>
                                    {t(`deck.visibility.${visibility}`)}
                                </Badge>
                            )}
                        </div>

                        {deck.description && (
                            <p className='mt-5 max-w-2xl text-sm leading-relaxed text-surface-subtle'>
                                {locale(deck.description)}
                            </p>
                        )}

                        {deck.tags.length > 0 && (
                            <ul className='mt-5 flex flex-wrap gap-1.5'>
                                {deck.tags.map((tag) => (
                                    <li
                                        key={tag}
                                        className='rounded-sm border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-surface-muted'
                                    >
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <dl className='mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3'>
                            <div>
                                <dt className='font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-surface-muted'>
                                    {t('deck.details.contents')}
                                </dt>
                                <dd className='mt-1 text-sm font-semibold text-surface-foreground'>
                                    {t('deck.itemCount', { count: deck.contentIds.length })}
                                </dd>
                            </div>
                            {deck.meta?.version && (
                                <div>
                                    <dt className='font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-surface-muted'>
                                        {t('deck.details.version')}
                                    </dt>
                                    <dd className='mt-1 font-mono text-sm font-semibold text-surface-foreground'>
                                        {deck.meta.version}
                                    </dd>
                                </div>
                            )}
                            {deck.meta?.updatedAt && deck.source !== 'official' && (
                                <div>
                                    <dt className='font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-surface-muted'>
                                        {t('deck.details.updated')}
                                    </dt>
                                    <dd className='mt-1 text-sm font-semibold text-surface-foreground'>
                                        <time dateTime={deck.meta.updatedAt}>
                                            {formatRelativeTime(
                                                deck.meta.updatedAt,
                                                i18n.language,
                                            )}
                                        </time>
                                    </dd>
                                </div>
                            )}
                        </dl>

                        <div className='mt-8'>
                            {start ? (
                                <Link
                                    to={start}
                                    className='inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-emphasis'
                                >
                                    {t('deck.start')}
                                    <FaArrowRight className='h-3.5 w-3.5' />
                                </Link>
                            ) : (
                                <p className='border border-dashed border-line-strong px-4 py-3 text-sm text-surface-muted'>
                                    {t('deck.details.noSession', {
                                        language: t(`languageSelect.languages.${language}.name`),
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
