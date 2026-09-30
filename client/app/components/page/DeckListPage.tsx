// -Path: 'client/app/components/page/DeckListPage.tsx'
// Shell for every deck-list page. One component serves vocabulary, reading,
// exam and review in every language, so all the variation arrives as props.
//
// Layout follows the track hubs — the shared `PageShell` frame and `PageHero`
// header — with `DeckList` owning everything below it: the source selector, the
// view controls, the filters and the grid. The shell's only real job beyond the
// frame is holding the query in the URL, so that the source tab, the search and
// every view option survive a reload and travel in a shared link.
import PageHero from '~/components/custom/PageHero';
import PageShell from '~/components/custom/PageShell';
import DeckList from '~/components/container/DeckList/DeckList';
import { useDeckListQuery } from '~/hooks/useDeckListQuery';
import { useTranslation } from 'react-i18next';
import type { DeckType } from '~/types/deck';
import type { Languages } from '~/data/language';

/** The deck types that get a list page. `drill` is a single-session page of
 *  its own, so it has no list — and therefore no per-type copy either. */
type ListType = Exclude<DeckType, 'drill'>;

export default function DeckListPage({ type, language }: { type: ListType; language: Languages }) {
    const { t } = useTranslation();
    // The URL is the only storage for the view state, so the page shell and the
    // list can never disagree about what tab is open.
    const controls = useDeckListQuery();

    /** Copy authored per language and type, falling back to the shared
     *  per-type string. Japanese vocabulary and reading have hand-written
     *  copy; exam, review and every English track fall back. */
    const copy = (key: 'eyebrow' | 'title' | 'description') =>
        t(`${language}.${type}.${key}`, { defaultValue: t(`deck.list.${key}.${type}`) });

    return (
        <PageShell
            width='wide'
            backTo={`/${language}`}
            backLabel={t(`${language}.${type}.back_hub`, {
                defaultValue: t('deck.list.backHub', {
                    language: t(`languageSelect.languages.${language}.name`),
                }),
            })}
        >
            <PageHero
                badge={copy('eyebrow')}
                title={copy('title')}
                description={copy('description')}
            />

            <DeckList
                type={type}
                language={language}
                query={controls.query}
                controls={controls}
            />
        </PageShell>
    );
}