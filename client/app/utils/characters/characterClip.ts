// -Path: 'client/app/utils/characters/characterClip.ts'
import type { CharLang } from '~/types/characters';

/** A pre-rendered character voice shipped with the app. */
export type CharacterClipVoice = 'female' | 'male';

/** The clip voices a chart offers, in the order they are listed. */
export const CHARACTER_CLIP_VOICES: readonly CharacterClipVoice[] = ['female', 'male'];

/**
 * The languages that ship character clips under
 * `public/<lang>/sound/<voice>/`. Every other chart stays silent until its
 * clips are generated.
 */
const CLIP_LANGUAGES: readonly CharLang[] = ['en', 'ja', 'th'];

/** The clip that is sounding right now, so the next one can stop it. */
let activeClip: HTMLAudioElement | null = null;

/**
 * Whether a chart ships pre-rendered clips.
 *
 * @param lang - The chart's target language.
 * @returns `true` when the language has clip files.
 */
export function hasCharacterClips(lang: CharLang): boolean {
    return CLIP_LANGUAGES.includes(lang);
}

/**
 * The URL of the clip that speaks one character, or an empty string when the
 * chart has no clips. File names are ASCII slugs (`ko-kai.mp3`), so they are
 * safe to put straight into a URL.
 *
 * @param lang - The chart's target language.
 * @param sound - The clip file name stored on the character.
 * @param voice - The clip voice to speak it with.
 * @returns The clip URL, or an empty string.
 */
export function characterClipUrl(lang: CharLang, sound: string, voice: CharacterClipVoice): string {
    if (!sound || !hasCharacterClips(lang)) return '';
    return `/${lang}/sound/${voice}/${encodeURIComponent(sound)}`;
}

/** Stops the clip that is sounding, if any. */
export function stopCharacterClip(): void {
    if (!activeClip) return;
    activeClip.pause();
    activeClip = null;
}

/**
 * Plays one character clip through a single shared audio element, so a tap
 * always replaces the previous sound.
 *
 * @param src - The clip URL from {@link characterClipUrl}.
 * @param volume - Playback volume, 0 to 1.
 * @param onEnd - Called when the clip finishes.
 * @param onError - Called when the file is missing or cannot be played.
 * @returns `true` when playback started, `false` when it could not.
 */
export function playCharacterClip(
    src: string,
    volume: number,
    onEnd?: () => void,
    onError?: () => void,
): boolean {
    if (typeof window === 'undefined' || !src) return false;

    stopCharacterClip();

    const audio = new Audio(src);
    let settled = false;
    const fail = () => {
        if (settled) return;
        settled = true;
        if (activeClip === audio) activeClip = null;
        onError?.();
    };

    audio.volume = volume;
    activeClip = audio;
    audio.onended = () => {
        if (settled) return;
        settled = true;
        if (activeClip === audio) activeClip = null;
        onEnd?.();
    };
    audio.onerror = fail;
    void audio.play().catch(fail);

    return true;
}
