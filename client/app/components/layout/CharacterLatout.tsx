// -Path: 'client/app/pages/characters/CharacterChart.tsx'
import { useParams } from 'react-router';
import { targetFromCode } from '~/utils/config/targetLang';
import NotFoundPanel from '~/components/page/character/NotFoundPanel';
import { ALL_TARGETS, targetLanguage, type LangCode } from '~/data/language';

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
    const { target } = useParams();
    const targetLang = targetFromCode(target);
    const language = targetLang === ALL_TARGETS ? undefined : targetLang;
    const code = language ? targetLanguage(language)?.code : undefined;

    if (code && pages[code]) return pages[code];
    return <NotFoundPanel />;
}
