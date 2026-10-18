// -Path: 'client/app/pages/characters/CharacterChart.tsx'
import EnChartPage from './en/EnChart';
import JaChartPage from './ja/JaChart';
import CharacterLayout from '~/components/layout/CharacterLatout';

/**
 * The character chart for `:target`. The target language's capabilities decide
 * which chart to show: English and Japanese have a page, and every other
 * language (or an unknown target) falls through to the fallback panel —
 * coming soon for a known language, not found for anything else. The route
 * carries a concrete target, so the deck-list "all languages" filter is
 * dropped here.
 */
export default function CharacterChart() {
    return <CharacterLayout en={<EnChartPage />} ja={<JaChartPage />} />;
}
