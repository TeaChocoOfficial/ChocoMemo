// -Path: 'client/app/pages/study/hooks/useStudyTargets.ts'
import { languages } from '~/data/language';
import { useTargetLang } from '~/hooks/useTargetLang';
import type {
    AvailableLanguage,
    CharacterSetConfig,
    DrillConfig,
    TargetStatus,
} from '~/data/language';

/** A character-set tile or drill row, annotated for the study hub. */
export interface StudyItem<Feature> {
    /** The language the item belongs to. */
    language: AvailableLanguage;
    /** The feature's config — a chart or a drill. */
    feature: Feature;
    /** True when this language is the active target. */
    active: boolean;
    /** The feature's own readiness, not the language's. */
    status: TargetStatus;
}

export interface StudyTargets {
    characters: StudyItem<CharacterSetConfig>[];
    drills: StudyItem<DrillConfig>[];
    /** The active language's config entry, or `undefined` if unknown. */
    active: AvailableLanguage | undefined;
}

/** Ready items first, then coming soon, each keeping the config order. */
function readyFirst<Feature>(items: StudyItem<Feature>[]): StudyItem<Feature>[] {
    return [...items].sort((a, b) => Number(a.status !== 'ready') - Number(b.status !== 'ready'));
}

/**
 * The study hub's character and drill items, derived from the capabilities
 * config: every language that has the feature, ready ones first, the active
 * target flagged. Adding a language only needs a config entry.
 */
export function useStudyTargets(): StudyTargets {
    const targetLang = useTargetLang();

    const characters = readyFirst(
        languages.flatMap((language) =>
            language.characters
                ? [
                      {
                          language,
                          feature: language.characters,
                          active: language.id === targetLang,
                          status: language.characters.status,
                      },
                  ]
                : [],
        ),
    );

    const drills = readyFirst(
        languages.flatMap((language) =>
            language.drill
                ? [
                      {
                          language,
                          feature: language.drill,
                          active: language.id === targetLang,
                          status: language.drill.status,
                      },
                  ]
                : [],
        ),
    );

    return {
        characters,
        drills,
        active: languages.find((language) => language.id === targetLang),
    };
}
