// -Path: 'client/app/pages/drill/CharacterDrill.tsx'
import EnDrillPage from './en/EnDrill';
import JaDrillPage from './ja/JaDrill';
import CharacterLayout from '~/components/layout/CharacterLatout';

/**
 * The character drill for `:target`. The target language's capabilities decide
 * which drill to show: English and Japanese have a page, and every other
 * language (or an unknown target) falls through to the fallback panel —
 * coming soon for a known language, not found for anything else. The route
 * carries a concrete target, so the deck-list "all languages" filter is
 * dropped here.
 */
export default function CharacterDrill() {
    return <CharacterLayout en={<EnDrillPage />} ja={<JaDrillPage />} />;
}
