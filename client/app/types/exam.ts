// -Path: 'client/app/types/exam.ts'
import type { LangText } from './vocabulary';

export interface ExamQuestion {
    id: string;
    prompt: string; // the word/kanji being tested
    promptReading?: string;
    /** Localized meaning — `LangText` so built-in sets follow the user's
     *  language like every other page. */
    correctAnswer: LangText;
    /** Includes correctAnswer, pre-shuffled at build time. */
    options: LangText[];
}

export type ExamSetSource = 'default' | 'custom' | 'imported';

export interface ExamSet {
    id: string;
    title: string;
    description?: string;
    source: ExamSetSource;
    authorName?: string; // only meaningful for 'imported'
    questions: ExamQuestion[];
    createdAt: number;
}