// -Path: 'client/app/pages/study/hooks/useStudyTargets.ts'
import { languages } from '~/data/language';
import type { AvailableLanguage } from '~/data/language';
import { useTargetLang } from '~/hooks/base/useTargetLang';

/** A character-set tile or drill row, annotated for the study hub. */
export interface StudyItem extends AvailableLanguage {
    /** True when this language is the active target. */
    active: boolean;
}

export interface StudyTargets {
    characters: StudyItem[];
    /** The active language's config entry, or `undefined` if unknown. */
    active: AvailableLanguage | undefined;
}

/**
 * The study hub's character and drill items, derived from the capabilities
 * config: every language that has the feature, the active target flagged.
 * Adding a language only needs a config entry.
 */
export function useStudyTargets(): StudyTargets {
    const targetLang = useTargetLang();

    const characters: StudyItem[] = languages.flatMap((language) =>
        language.code !== 'other' ? [{ ...language, active: language.id === targetLang }] : [],
    );

    return { characters, active: languages.find((language) => language.id === targetLang) };
}
