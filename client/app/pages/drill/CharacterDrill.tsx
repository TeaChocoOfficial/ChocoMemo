// -Path: 'client/app/pages/drill/CharacterDrill.tsx'
import { useParams } from 'react-router';
import { ALL_TARGETS, targetLanguage } from '~/data/language';
import { targetFromCode } from '~/utils/config/targetLang';
import KanaDrill from './kana/KanaDrill';
import CharacterComingSoon from '~/pages/characters/CharacterComingSoon';

/**
 * The character drill for `:target`. The target language's capabilities decide
 * which drill to show; only kana exists today, so every other language (and an
 * unknown target) falls through to the coming-soon notice. The route carries a
 * concrete target, so the deck-list "all languages" filter is dropped here.
 */
export default function CharacterDrill() {
    const { target } = useParams();
    const targetLang = targetFromCode(target);
    const language = targetLang === ALL_TARGETS ? undefined : targetLang;
    const set = language ? targetLanguage(language)?.characters?.id : undefined;

    if (set === 'kana') return <KanaDrill />;
    return <CharacterComingSoon targetLang={language} />;
}
