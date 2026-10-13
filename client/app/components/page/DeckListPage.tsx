// -Path: 'client/app/components/page/DeckListPage.tsx'
// Shell for every deck-list page. One component serves vocabulary, reading,
// exam and review in every language, so all the variation arrives as props.
//
// No title block of its own: a deck list is only ever reached from the hub,
// which has already said what the feature is, so a hero here would repeat it
// one click later. What is left is the shared `PageShell` frame and `DeckList`,
// which owns the source selector, the view controls, the filters and the grid.
//
// The shell's one real job beyond the frame is holding the view state in the
// URL, so the source tab, the search and every view option survive a reload and
// travel in a shared link. The target language comes from `?target=` (falling
// back to the persisted choice), so the same route serves every language.
import type { DeckType } from '~/types/deck';
import { useTranslation } from 'react-i18next';
import PageShell from '~/components/custom/PageShell';
import DeckList from '~/components/container/DeckList/DeckList';
import { useDeckListQuery } from '~/hooks/deck/useDeckListQuery';

/** The deck types that get a list page. `drill` is a single-session page of
 *  its own, so it has no list — and therefore no per-type copy either. */
type ListType = Exclude<DeckType, 'drill'>;

export default function DeckListPage({ type }: { type: ListType }) {
    const { t } = useTranslation();
    // The URL is the only storage for the view state, so the page shell and the
    // list can never disagree about what tab is open.
    const controls = useDeckListQuery();

    return (
        <PageShell width='wide' backTo='/study' backLabel={t('deck.list.backStudy')}>
            <DeckList type={type} controls={controls} query={controls.query} />
        </PageShell>
    );
}
