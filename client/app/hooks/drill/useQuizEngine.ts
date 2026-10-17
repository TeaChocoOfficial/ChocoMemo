// Shared helpers for driving multiple-choice quizzes.
// Deterministic-enough: options are shuffled once per quiz round.

export interface Choice {
    id: string;
    label: string;
    isCorrect: boolean;
}

export interface QuizQuestionData {
    prompt: string;
    promptHint?: string;
    choices: Choice[];
}

function shuffle<T>(input: T[]): T[] {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function uniqueStrings(values: string[]): string[] {
    return Array.from(new Set(values));
}

export interface BuildChoiceOptions {
    correctLabel: string;
    allLabels: string[];
    count?: number;
}

/** Picks `count` wrong distractors (unique, excluding the correct label) and returns 4 shuffled choices. */
export function buildChoices({
    correctLabel,
    allLabels,
    count = 3,
}: BuildChoiceOptions): Choice[] {
    const distractors = uniqueStrings(
        allLabels.filter((label) => label !== correctLabel),
    )
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

    const choices: Choice[] = [
        { id: 'correct', label: correctLabel, isCorrect: true },
        ...distractors.map((label, i) => ({
            id: `d-${i}`,
            label,
            isCorrect: false,
        })),
    ];

    return shuffle(choices).map((c, i) => ({ ...c, id: `${c.id}-${i}` }));
}
