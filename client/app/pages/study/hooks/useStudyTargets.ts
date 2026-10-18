// -Path: 'client/app/pages/study/hooks/useStudyTargets.ts'
import { languages } from '~/data/language';
import { useTargetLang } from '~/hooks/base/useTargetLang';
import type { DrillConfig, AvailableLanguage, CharacterSetConfig } from '~/data/language';

/** A character-set tile or drill row, annotated for the study hub. */
export interface StudyItem<Feature> {
    /** The language the item belongs to. */
    language: AvailableLanguage;
    /** The feature's config — a chart or a drill. */
    feature: Feature;
    /** True when this language is the active target. */
    active: boolean;
}

export interface StudyTargets {
    characters: StudyItem<CharacterSetConfig>[];
    drills: StudyItem<DrillConfig>[];
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

    const characters = languages.flatMap((language) =>
        language.characters
            ? [
                  {
                      language,
                      feature: language.characters,
                      active: language.id === targetLang,
                  },
              ]
            : [],
    );

    const drills = languages.flatMap((language) =>
        language.drill
            ? [
                  {
                      language,
                      feature: language.drill,
                      active: language.id === targetLang,
                  },
              ]
            : [],
    );

    return {
        characters,
        drills,
        active: languages.find((language) => language.id === targetLang),
    };
}
