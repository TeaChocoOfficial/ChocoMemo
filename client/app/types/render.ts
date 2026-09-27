// -Path: 'client/app/types/render.ts'
import type { LangText } from './type';
import type { VocabSegment } from './vocabulary';

/** One line of a reading passage. Segments carry per-kanji furigana (`rt`) and
 *  an optional gloss (`mn`), so a reader can hover or tap a run for its
 *  meaning without leaving the passage. */
export interface RenderLine {
    segments: VocabSegment[];
}

/** A titled passage: the reading material itself plus its translation. */
export interface RenderPassage {
    id: string;
    title: string;
    /** Short hint shown under the title, e.g. the grammar focus. */
    note?: LangText;
    lines: RenderLine[];
    translation: LangText;
}

export type RenderSource = 'default' | 'local';

/** Metadata shared with the other deck lists so one card can render any of
 *  them. `count` is passages for a render deck and words elsewhere. */
export interface RenderDeckMeta {
    author?: string;
    createdAt?: string;
}

export interface RenderDeck {
    id: string;
    name: LangText;
    description?: LangText;
    source: RenderSource;
    /** Furigana-level focus of the deck, shown as a tape label. */
    focus?: string;
    tags: string[];
    nsfw: boolean;
    passageIds: string[];
    meta?: RenderDeckMeta;
}
