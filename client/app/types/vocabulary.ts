// -Path: 'client/app/types/vocabulary.ts'
import type { Lang } from '../i18n/locales';

export type VocabMeaning = string | Partial<Record<Lang, string>>;

/** One character (or kana run) of the target word inside the example
 *  sentence. A kanji carries its own reading (`rt`); okurigana written
 *  as kana has no `rt` and renders bare. This keeps the sentence text
 *  surface form independent from the dictionary form (`word.word`) and
 *  lets each kanji get its own furigana instead of spreading a single
 *  reading across the whole word.
 *  @variation ch characater
 *  @variation rt 
 *  @variation mn meaning
 *  @variation dt details
 */
export interface VocabSegment {
    ch: string;
    rt?: string;
    mn?: VocabMeaning;
    dt?: VocabMeaning;
}

/** The example sentence is split into `before` / `segments` / `after` so
 *  the target's surface form and its per-character readings are stored
 *  explicitly instead of pasting `word.word` (dictionary form) in the
 *  middle — pasting breaks once the word is conjugated (e.g. 飲む →
 *  飲みましょう). Every part is segmented so every kanji in the sentence
 *  gets its own furigana, not just the target. */
export interface VocabExample {
    before: VocabSegment[];
    segments: VocabSegment[];
    after: VocabSegment[];
    meaning: VocabMeaning;
}

export interface VocabWord {
    id: string;
    word: string;
    reading: string;
    meaning: VocabMeaning;
    example: VocabExample;
    note?: VocabMeaning;
    imageUrl?: string;
    audioWordUrl?: string;
    audioSentenceUrl?: string;
}
