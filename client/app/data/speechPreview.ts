// -Path: 'client/app/data/speechPreview.ts'

/** A short TTS preview sample per BCP47 base language tag. */
const SPEECH_PREVIEW: Record<string, string> = {
    ja: 'あ い う え お',
    en: 'A B C D E',
    ko: '가 나 다 라 마',
    th: 'ก ข ค ง จ',
    zh: '一 二 三 四 五',
};

/**
 * The preview text for a BCP47 tag. `other` (and any unknown tag) has no
 * single language, so it falls back to the neutral English sample.
 *
 * @param speechLang - BCP47 tag the preview will be spoken with.
 * @returns A short sample in that language.
 */
export function speechPreviewFor(speechLang: string): string {
    return SPEECH_PREVIEW[speechLang.toLowerCase().split('-')[0]] ?? SPEECH_PREVIEW.en;
}
