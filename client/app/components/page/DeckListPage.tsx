// -Path: 'client/app/components/page/DeckListPage.tsx'
// Shell for every deck-list page. One component serves vocabulary, reading,
// exam and review in every language, so all the variation arrives as props.
//
// No title block of its own: a deck list is only ever reached from its track
// hub, which has already said what the feature is, so a hero here would repeat
// it one click later. What is left is the shared `PageShell` frame and
// `DeckList`, which owns the source selector, the view controls, the filters
// and the grid.
//
// The shell's one real job beyond the frame is holding the view state in the
// URL, so the source tab, the search and every view option survive a reload and
// travel in a shared link.
import type { DeckType } from '~/types/deck';
import { useTranslation } from 'react-i18next';
import type { Languages } from '~/data/language';
import PageShell from '~/components/custom/PageShell';
import { useDeckListQuery } from '~/hooks/useDeckListQuery';
import DeckList from '~/components/container/DeckList/DeckList';

/** The deck types that get a list page. `drill` is a single-session page of
 *  its own, so it has no list — and therefore no per-type copy either. */
type ListType = Exclude<DeckType, 'drill'>;

export default function DeckListPage({ type, language }: { type: ListType; language: Languages }) {
    const { t } = useTranslation();
    // The URL is the only storage for the view state, so the page shell and the
    // list can never disagree about what tab is open.
    const controls = useDeckListQuery();

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
            <DeckList type={type} language={language} query={controls.query} controls={controls} />
        </PageShell>
    );
}
