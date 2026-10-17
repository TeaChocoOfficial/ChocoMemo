// Utility for playing short feedback sounds for the kana drill.
// Two styles are supported:
//  - 'voice' plays recorded Japanese voice clips from /japanese/sound.
//  - 'tone' plays simple synthesized beeps via the Web Audio API.

export type DrillSoundKind = 'correct' | 'incorrect' | 'timeout';

const phrases: Record<DrillSoundKind, string[]> = {
    correct: ['そう', 'はい', '正しい'],
    incorrect: ['そうだはない', '正しくない', '間違い'],
    timeout: ['大丈夫', '時間が経ちました', '残念'],
};

const clipCount = 8;

const randomInt = (max: number) => Math.floor(Math.random() * max);

const playVoice = (kind: DrillSoundKind, volume = 1) => {
    const phrasesOfKind = phrases[kind];
    const phrase = phrasesOfKind[randomInt(phrasesOfKind.length)];
    const index = randomInt(clipCount) + 1;
    const url = `/japanese/sound/${kind}/${encodeURIComponent(`${phrase} (${index})`)}.wav`;
    const audio = new Audio(url);
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audio.play().catch(() => {});
};

const playTone = (kind: DrillSoundKind, volume = 1) => {
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    if (kind === 'correct') {
        playBeep(ctx, now, 784, 0.12, volume);
        playBeep(ctx, now + 0.12, 1046, 0.2, volume);
    } else if (kind === 'incorrect') {
        playBeep(ctx, now, 233, 0.25, volume);
    } else {
        playBeep(ctx, now, 440, 0.15, volume);
        playBeep(ctx, now + 0.18, 311, 0.3, volume);
    }
};

const playBeep = (ctx: AudioContext, when: number, freq: number, dur: number, volume = 1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, when);
    gain.gain.exponentialRampToValueAtTime(0.4 * volume, when + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(when);
    osc.stop(when + dur + 0.05);
};

export function playDrillSound(
    kind: DrillSoundKind,
    style: 'voice' | 'tone' = 'voice',
    volume = 1,
) {
    if (style === 'tone') {
        playTone(kind, volume);
    } else {
        playVoice(kind, volume);
    }
}