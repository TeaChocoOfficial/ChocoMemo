// -Path: 'client/app/pages/japanese/review/hooks/segments.tsx'
import { useState } from 'react';
import type { ReactNode } from 'react';
import { FaCheck, FaCopy, FaVolumeHigh } from 'react-icons/fa6';
import { useSpeak } from '~/hooks/useSpeak';
import { useLangText } from '~/hooks/useLangText';
import type { VocabSegment, VocabWord } from '~/types/vocabulary';

/** Plain surface text of the target as it appears in the sentence. */
export function segmentsToText(segments: VocabSegment[]): string {
    return segments.map((seg) => seg.ch).join('');
}

/** Full example-sentence text: before + target surface + after. */
export function exampleSentence(word: VocabWord): string {
    return [...word.example.before, ...displaySegments(word), ...word.example.after]
        .map((seg) => seg.ch)
        .join('');
}

/** Segments to render as furigana: each kanji carries its own <rt>, while
 *  okurigana (kana) segments render bare. */
export function RubySegments({
    primary,
    segments,
}: {
    primary?: boolean;
    segments: VocabSegment[];
}) {
    return (
        <>
            {segments.map((seg, index) => {
                if (seg.rt) {
                    return (
                        <ruby key={index}>
                            {seg.ch}
                            <rt className={`text-xs ${primary ?'text-primary' : ''}`}>{seg.rt}</rt>
                        </ruby>
                    );
                }
                return <span key={index}>{seg.ch}</span>;
            })}
        </>
    );
}

/** Best-effort segments for words without explicit per-character data
 *  (user-added custom words, and legacy persisted items that predate the
 *  segments field): the whole word as one ruby unit. */
export function displaySegments(word: VocabWord): VocabSegment[] {
    if (word.example.segments && word.example.segments.length > 0) return word.example.segments;
    return [{ ch: word.word, rt: word.reading || undefined }];
}

/** One contiguous run of the sentence: either plain filler or a known
 *  vocabulary item the run maps to (matched by its surface form). */
export interface SentenceRun {
    vocab?: VocabWord;
    segments: VocabSegment[];
}

/** How a vocabulary item is spelled inside example sentences (its own
 *  target surface form — e.g. 食べる’s surface is 食べ in 食べましょう). */
function surfaceOf(w: VocabWord): string {
    return segmentsToText(displaySegments(w));
}

/** Slice `part` to the char range [start, end). Kanji segments carry their
 *  own rt; kana runs are split char-by-char so a match can end mid-run. */
function sliceByCharRange(part: VocabSegment[], start: number, end: number): VocabSegment[] {
    const out: VocabSegment[] = [];
    let offset = 0;
    for (const seg of part) {
        const segStart = offset;
        const segEnd = offset + seg.ch.length;
        if (segEnd > start && segStart < end) {
            const s = Math.max(segStart, start) - segStart;
            const e = Math.min(segEnd, end) - segStart;
            const ch = seg.ch.slice(s, e);
            out.push(seg.rt ? { ch, rt: seg.rt } : { ch });
        }
        offset = segEnd;
    }
    return out;
}

/** Particles and other function words that end a plain run instead of
 *  fusing into the preceding kanji word (e.g. 下 + に stay separate). */
const BOUNDARY_KANA = new Set(['は','が','を','に','で','の','へ','と','も','や','か','ね','よ','な','ぞ','ぜ','わ','こそ','から','まで','より','ほど','にも','では','にも','には','とは','でも','ても','ので','のに','からは']);

/** Polite verb endings, te-forms, and other trailing kana that end a plain
 *  run on their own (e.g. 座り + ます。 stay separate). */
const VERB_ENDING_KANA = /^(ます|ませ?ん|ましょう|ました|ましたら|です|でした|います|いません|ています|ていない|てない|でいる|でいます|たい|たく|ない|ながら|なさい|らしい|みたい|そうです)$/;

/** ます。 and friends — checked on the kana segment with punctuation stripped. */
function isVerbEnding(ch: string): boolean {
    return VERB_ENDING_KANA.test(ch.replace(/[。、「」]/g, ''));
}

/** Char offsets of the authored segment containing `offset`, and the char
 *  position right after it. */
function segIndexAt(part: VocabSegment[], offset: number): number {
    let pos = 0;
    for (let i = 0; i < part.length; i++) {
        const next = pos + part[i].ch.length;
        if (offset < next) return i;
        pos = next;
    }
    return part.length - 1;
}

function segEndAt(part: VocabSegment[], index: number): number {
    let end = 0;
    for (let i = 0; i <= index; i++) {
        end += part[i].ch.length;
    }
    return end;
}

/** Length of the plain run starting at char `start`: a kana-only segment is
 *  its own tip; a kanji segment fuses with the kana directly after it
 *  (okurigana like 座 + り) until a particle or verb ending breaks it. */
function plainRunLength(part: VocabSegment[], start: number): number {
    const idx = segIndexAt(part, start);
    if (!part[idx].rt) return segEndAt(part, idx) - start;
    let end = segEndAt(part, idx);
    let k = idx + 1;
    while (k < part.length && !part[k].rt) {
        if (BOUNDARY_KANA.has(part[k].ch) || isVerbEnding(part[k].ch)) break;
        end = segEndAt(part, k);
        k += 1;
    }
    return end - start;
}

/** Split one part of the example sentence into runs that are known
 *  vocabulary items (longest surface match wins) and plain filler. Plain
 *  runs are grouped into word-sized pieces (okurigana fused to their kanji,
 *  particles and polite endings kept separate). */
export function tokenizeSentencePart(part: VocabSegment[], words: VocabWord[]): SentenceRun[] {
    const text = segmentsToText(part);
    if (text.length === 0) return [];

    const surfaces = words
        .map((w) => ({ w, s: surfaceOf(w) }))
        .filter((x) => x.s.length > 0);

    const runs: SentenceRun[] = [];
    let i = 0;
    while (i < text.length) {
        let best: { w: VocabWord; s: string } | null = null;
        for (const entry of surfaces) {
            if (text.startsWith(entry.s, i) && (!best || entry.s.length > best.s.length)) {
                best = entry;
            }
        }
        if (best) {
            runs.push({
                vocab: best.w,
                segments: sliceByCharRange(part, i, i + best.s.length),
            });
            i += best.s.length;
        } else {
            const len = plainRunLength(part, i);
            runs.push({ segments: sliceByCharRange(part, i, i + len) });
            i += len;
        }
    }
    return runs;
}

/** Shared tooltip shell: appears above the run on hover and becomes
 *  clickable so the read-aloud button works. A transparent bridge fills the
 *  gap between run and tooltip so the pointer never leaves the hover group. */
function TipBody({
    label,
    reading,
    extra,
    copyText,
    onSpeak,
}: {
    label: string;
    reading?: string;
    extra?: string;
    copyText: string;
    onSpeak: () => void;
}) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        void navigator.clipboard.writeText(copyText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };

    return (
        <span className='pointer-events-none absolute bottom-full left-1/2 z-50 -translate-x-1/2 flex flex-col items-center opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100'>
            <span className='whitespace-nowrap rounded-sm border border-line bg-surface-elevated px-3 py-2 text-xs'>
                <span className='inline-flex items-center gap-2'>
                    <span className='font-bold text-surface-foreground'>{label}</span>
                    {reading && <span className='text-surface-muted'>{reading}</span>}
                    <button
                        type='button'
                        onClick={onSpeak}
                        aria-label='Read aloud'
                        className='inline-flex w-5 h-5 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary-emphasis cursor-pointer'
                    >
                        <FaVolumeHigh className='w-2.5 h-2.5' />
                    </button>
                    <button
                        type='button'
                        onClick={copy}
                        aria-label={copied ? 'Copied' : 'Copy'}
                        title={copied ? 'Copied' : 'Copy'}
                        className='inline-flex w-5 h-5 items-center justify-center rounded-full bg-surface-muted/20 text-surface-foreground hover:bg-surface-muted/40 cursor-pointer'
                    >
                        {copied ? <FaCheck className='w-2.5 h-2.5' /> : <FaCopy className='w-2.5 h-2.5' />}
                    </button>
                </span>
                {extra && <span className='mt-1 block text-surface-muted'>{extra}</span>}
            </span>
            <span className='h-2 w-full' />
        </span>
    );
}

/** Hover tip showing a vocabulary item's details (word, reading, meaning)
 *  plus a button that reads the word aloud. */
export function VocabTip({ word, children }: { word: VocabWord; children: ReactNode }) {
    const meaning = useLangText();
    const speak = useSpeak();
    const localized = meaning(word.meaning);
    return (
        <span className='group relative inline-flex items-end'>
            {children}
            <TipBody
                label={word.word}
                reading={`· ${word.reading}`}
                extra={localized}
                copyText={[word.word, word.reading, localized].filter(Boolean).join(' · ')}
                onSpeak={() => speak(word.word, word.audioWordUrl)}
            />
        </span>
    );
}

/** Hover tip for a plain (non-vocabulary) run: the run's surface text, its
 *  reading if it carries one, and a button that reads the run aloud. */
export function PlainSegmentTip({ segments }: { segments: VocabSegment[] }) {
    const speak = useSpeak();
    const surface = segmentsToText(segments);
    const reading = segments.map((seg) => seg.rt).find(Boolean);
    return (
        <span className='group relative inline-flex items-end'>
            <RubySegments segments={segments} />
            <TipBody
                label={surface}
                reading={reading}
                copyText={surface}
                onSpeak={() => speak(surface)}
            />
        </span>
    );
}

/** Render a sentence run with furigana, wrapping every run in a hover tip:
 *  vocabulary runs show the item's details + read button, plain filler a
 *  char tip + read button. */
export function RubySentenceRun({ run }: { run: SentenceRun }) {
    if (run.vocab) {
        return (
            <VocabTip word={run.vocab}>
                <RubySegments segments={run.segments} />
            </VocabTip>
        );
    }
    return <PlainSegmentTip segments={run.segments} />;
}
