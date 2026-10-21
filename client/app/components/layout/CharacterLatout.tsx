// -Path: 'client/app/pages/characters/CharacterChart.tsx'
import { type LangCode } from '~/data/language';
import useTargetLang from '~/hooks/characters/useTargetLang';
import NotFoundPanel from '~/components/page/character/NotFoundPanel';

/**
 * The character layout for `:target`. The target language's capabilities decide
 * which layout to show: English and Japanese have a page, and every other
 * language (or an unknown target) falls through to the fallback panel —
 * coming soon for a known language, not found for anything else. The route
 * carries a concrete target, so the deck-list "all languages" filter is
 * dropped here.
 */
export default function CharacterLayout(
    pages: Partial<Record<LangCode, React.ReactNode>>,
): React.ReactNode {
    const { code } = useTargetLang();

    if (code && pages[code]) return pages[code];
    return <NotFoundPanel />;
}
