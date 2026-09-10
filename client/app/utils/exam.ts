// -Path: 'client/app/utils/exam.ts'
import { z } from 'zod';
import type { VocabExample, VocabWord } from '~/types/vocabulary';
import type {
    ExamQuestion,
    ExamSet,
    ExamSetSource,
    FillBlankExamQuestion,
    MeaningExamQuestion,
} from '~/types/exam';

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

function randomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
}

/** Reading hint for a fill-in-the-blank sentence: the visible surface text
 *  plus the target word itself, so the learner matches pronunciation to the
 *  written form among the options. */
function sentenceReading(example: VocabExample): string | undefined {
    const parts = [...example.before, ...example.segments, ...example.after];
    const reading = parts.map((s) => s.rt ?? s.ch).join('');
    return reading || undefined;
}

/** Builds a mixed-type multiple-choice exam set out of existing vocabulary
 *  data. 'meaning' questions (word → meaning) and 'fillBlank' questions
 *  (sentence with the word blanked out) alternate evenly. Distractors are
 *  pulled from other words in the same list — meanings for 'meaning'
 *  questions, word forms for 'fillBlank' questions.
 *
 *  Distractor count varies from 2 to 7 (so options range 3–8) and shrinks
 *  automatically on very small pools: it never throws, falling back to as
 *  few options as the pool allows instead. */
export function buildExamSetFromVocabulary(
    words: VocabWord[],
    opts: { id: string; title: string; description?: string; source?: ExamSetSource },
): ExamSet {
    const questions: ExamQuestion[] = words.map((word, i) => {
        const others = words.filter((w) => w.id !== word.id);
        const maxDistractors = Math.min(others.length, 7);
        const minDistractors = Math.min(2, maxDistractors);
        const distractorCount =
            maxDistractors <= minDistractors
                ? maxDistractors
                : randomInt(minDistractors, maxDistractors);

        if (i % 2 === 1) {
            const distractors = shuffle(others.map((w) => w.word)).slice(0, distractorCount);
            const question: FillBlankExamQuestion = {
                id: `${word.id}-fillblank`,
                type: 'fillBlank',
                sentenceBefore: word.example.before.map((s) => s.ch).join(''),
                sentenceAfter: word.example.after.map((s) => s.ch).join(''),
                sentenceReading: sentenceReading(word.example),
                correctAnswer: word.word,
                options: shuffle([word.word, ...distractors]),
            };
            return question;
        }

        const distractors = shuffle(others.map((w) => w.meaning)).slice(0, distractorCount);
        const question: MeaningExamQuestion = {
            id: word.id,
            type: 'meaning',
            prompt: word.word,
            promptReading: word.reading,
            correctAnswer: word.meaning,
            options: shuffle([word.meaning, ...distractors]),
        };
        return question;
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

const optionField = z.array(answerField).min(2).max(8);

const meaningQuestionSchema = z.object({
    id: z.string(),
    type: z.literal('meaning'),
    prompt: z.string(),
    promptReading: z.string().optional(),
    correctAnswer: answerField,
    options: optionField,
});

const fillBlankQuestionSchema = z.object({
    id: z.string(),
    type: z.literal('fillBlank'),
    sentenceBefore: z.string(),
    sentenceAfter: z.string(),
    sentenceReading: z.string().optional(),
    correctAnswer: answerField,
    options: optionField,
});

const examQuestionSchema = z.discriminatedUnion('type', [
    meaningQuestionSchema,
    fillBlankQuestionSchema,
]);

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