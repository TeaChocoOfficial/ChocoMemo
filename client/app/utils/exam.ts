// -Path: 'client/app/utils/exam.ts'
import { z } from 'zod';
import type { VocabWord } from '~/types/vocabulary';
import type { ExamQuestion, ExamSet, ExamSetSource } from '~/types/exam';

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

/** Builds a multiple-choice exam set out of existing vocabulary data.
 *  Distractors are pulled from other words' meanings in the same list, so
 *  it needs at least 2 words to produce any options at all — with very
 *  small custom lists it falls back to fewer than 4 choices rather than
 *  throwing. */
export function buildExamSetFromVocabulary(
    words: VocabWord[],
    opts: { id: string; title: string; description?: string; source?: ExamSetSource },
): ExamSet {
    const questions: ExamQuestion[] = words.map((word) => {
        const pool = words
            .filter((w) => w.id !== word.id)
            .map((w) => w.meaning);
        const distractors = shuffle(pool).slice(0, 3);
        return {
            id: word.id,
            prompt: word.word,
            promptReading: word.reading,
            correctAnswer: word.meaning,
            options: shuffle([word.meaning, ...distractors]),
        };
    });

    return {
        id: opts.id,
        title: opts.title,
        description: opts.description,
        source: opts.source ?? 'default',
        questions,
        createdAt: Date.now(),
    };
}

// A meaning is either a plain string (imported files/custom words) or a
// per-locale record (built-in sets) — accepting both keeps the exported
// default sets importable again.
const answerField = z.string().or(z.record(z.string(), z.string()));

const examQuestionSchema = z.object({
    id: z.string(),
    prompt: z.string(),
    promptReading: z.string().optional(),
    correctAnswer: answerField,
    options: z.array(answerField).min(2),
});

/** Validates the shape of an imported exam set file. Doesn't trust the
 *  file's own `source`/`id` — those are reassigned by the caller so an
 *  imported file can't silently overwrite an existing set or masquerade
 *  as a default one. */
export const importedExamSetSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    authorName: z.string().optional(),
    questions: z.array(examQuestionSchema).min(1),
});

/** Downloads an exam set as a .json file that `importSet` can read back. */
export function exportExamSet(set: ExamSet) {
    const payload = {
        title: set.title,
        description: set.description,
        authorName: set.authorName,
        questions: set.questions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${set.title.replace(/\s+/g, '-').toLowerCase()}.chocomemo-exam.json`;
    a.click();
    URL.revokeObjectURL(url);
}