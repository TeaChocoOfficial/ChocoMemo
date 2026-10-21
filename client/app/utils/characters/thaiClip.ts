// -Path: 'client/app/utils/characters/thaiClip.ts'

/** The pre-rendered Thai voices shipped with the app. */
export type ThaiClipVoice = 'male' | 'female';

/** Every clip voice the app ships, in the order they are offered. */
export const THAI_CLIP_VOICES: readonly ThaiClipVoice[] = ['female', 'male'];

/**
 * The clip that speaks a Thai character, or an empty string when there is
 * none. The clip speaks the character's name, the same text the Google Cloud
 * TTS voice reads, so both tiers sound alike.
 *
 * @param sound - The mp3 file name of the character, e.g. `ko-kai.mp3`.
 * @param voice - The clip voice to speak it with.
 * @returns The URL of the clip, or an empty string.
 */
export function thaiClipUrl(sound: string, voice: ThaiClipVoice): string {
    if (!sound) return '';
    return `/th/sound/${voice}/${encodeURIComponent(sound)}`;
}
