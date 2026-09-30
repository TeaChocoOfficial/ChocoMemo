// -Path: 'client/app/types/exam.ts'
import type { DeckSource } from '../deck';
import type { LangText } from '../type';

export type ExamQuestionType = 'meaning' | 'fillBlank';

interface BaseExamQuestion {
    id: string;
    type: ExamQuestionType;
    correctAnswer: LangText;
    /** 2 to 8 options, pre-shuffled at build time. NOT always 4. */
    options: LangText[];
}

/** "What does this word mean?" — prompt is the word/kanji being tested. */
export interface MeaningExamQuestion extends BaseExamQuestion {
    type: 'meaning';
    prompt: string; // the word/kanji being tested
    promptReading?: string;
}

/** "Fill in the blank" — a sentence with the target word blanked out. */
export interface FillBlankExamQuestion extends BaseExamQuestion {
    type: 'fillBlank';
    sentenceBefore: string; // text before the blank
    sentenceAfter: string; // text after the blank
    sentenceReading?: string; // optional furigana/reading hint for the sentence
}

export type ExamQuestion = MeaningExamQuestion | FillBlankExamQuestion;

export interface ExamSet {
    id: string;
    title: string;
    description?: string;
    source: DeckSource;
    authorName?: string; // only meaningful for 'imported'
    questions: ExamQuestion[];
    createdAt: number;
}
