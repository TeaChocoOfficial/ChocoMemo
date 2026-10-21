import { useParams } from 'react-router';
import { ALL_TARGETS, targetLanguage } from '~/data/language';
import { targetFromCode } from '~/utils/config/targetLang';

export default function useTargetLang() {
    const { target } = useParams();
    const targetLang = targetFromCode(target);
    const language = targetLang === ALL_TARGETS ? undefined : targetLang;
    const code = language ? targetLanguage(language)?.code : undefined;
    return { code, language };
}
