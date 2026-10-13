// -Path: 'client/app/pages/drill/CharacterDrill.tsx'
import { useParams } from 'react-router';
import { targetLanguage } from '~/data/language';
import { targetFromCode } from '~/utils/targetLang';
import KanaDrill from './kana/KanaDrill';
import CharacterComingSoon from '~/pages/characters/CharacterComingSoon';

/**
 * The character drill for `:target`. The target language's capabilities decide
 * which drill to show; only kana exists today, so every other language (and an
 * unknown target) falls through to the coming-soon notice.
 */
export default function CharacterDrill() {
    const { target } = useParams();
    const targetLang = targetFromCode(target);
    const set = targetLang ? targetLanguage(targetLang)?.characters?.id : undefined;

    if (set === 'kana') return <KanaDrill />;
    return <CharacterComingSoon targetLang={targetLang} />;
}
