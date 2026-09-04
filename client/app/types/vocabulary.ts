// -Path: 'client/app/types/vocabulary.ts'

/** The example sentence is split into `before`/`after` around the target
 *  word instead of storing one full string and doing string.split() later —
 *  splitting on the word text breaks if it appears more than once in the
 *  sentence, or contains special regex characters. Storing the segments
 *  directly sidesteps that entirely. */
export interface VocabExample {
    before: string;
    after: string;
    targetReading: string; // furigana for the target word only
    english: string;
}

export interface VocabWord {
    id: string;
    word: string;
    reading: string;
    meaning: string;
    example: VocabExample;
    note?: string;
    imageUrl?: string;
    audioWordUrl?: string;
    audioSentenceUrl?: string;
}
