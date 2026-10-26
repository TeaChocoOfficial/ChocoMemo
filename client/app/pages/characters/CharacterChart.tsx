// -Path: 'client/app/pages/characters/CharacterChart.tsx'
import CharactersGrid from './CharactersGrid';
import type { KanaChars } from '~/data/ja/kana';
import CharactersPage from './components/CharactersPage';
import useTargetLang from '~/hooks/characters/useTargetLang';
import NotFoundPanel from '~/components/page/character/NotFoundPanel';
import { useCharacterToolbar } from '~/hooks/characters/useCharacterToolbar';

/** How many columns each kana group needs to keep its rows even. */
const groupColumns: Record<keyof KanaChars, number> = {
    voiceless: 5,
    voiced: 5,
    contracted: 3,
};

/**
 * The character chart for `:target`. The target language's capabilities decide
 * which chart to show: English, Japanese and Thai have a page, and every other
 * language (or an unknown target) falls through to the fallback panel —
 * coming soon for a known language, not found for anything else. The route
 * carries a concrete target, so the deck-list "all languages" filter is
 * dropped here.
 */
export default function CharacterChart() {
    const { code } = useTargetLang();

    function getClassName(): string | undefined {
        if (!code) return;
        const { activeSet, activeGroup } = useCharacterToolbar();
        switch (code) {
            case 'en':
                return 'grid grid-cols-5 gap-3 sm:gap-4';
            case 'ja': {
                const columns = groupColumns[activeGroup as keyof KanaChars];
                const gridCols = columns === 3 ? 'grid-cols-3' : 'grid-cols-5';
                return `grid ${gridCols} gap-3 sm:gap-4`;
            }
            case 'th': {
                const gridCols = activeSet === 'tones' ? 'grid-cols-4' : 'grid-cols-6';
                return `grid ${activeGroup === 'headless' ? 'font-thai' : ''} ${gridCols} gap-3 sm:gap-4`;
            }
        }
    }

    const className = getClassName();

    return className ? (
        <CharactersPage>
            <div className={className}>
                <CharactersGrid />
            </div>
        </CharactersPage>
    ) : (
        <NotFoundPanel />
    );
}
