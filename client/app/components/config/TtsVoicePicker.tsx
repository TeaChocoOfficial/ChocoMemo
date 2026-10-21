// -Path: 'client/app/components/config/TtsVoicePicker.tsx'
import { useEffect, useMemo } from 'react';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Select from '~/components/custom/Select';
import { useTtsSpeak } from '~/hooks/base/useTtsSpeak';
import { speechPreviewFor } from '~/data/speechPreview';
import RangeSlider from '~/components/custom/RangeSlider';
import { useSpeechStore } from '~/stores/config/speech.store';
import { useTtsVoiceStore } from '~/stores/config/ttsVoice.store';
import { resolveVoiceName, useTtsVoices } from '~/hooks/base/useTtsVoices';

/** Props for {@link TtsVoicePicker}. */
interface TtsVoicePickerProps {
    /** BCP47 tag of the language to speak, e.g. `th-TH`. */
    languageCode: string;
    /** Shown instead of the voice list when Google Cloud TTS is unreachable. */
    fallback?: React.ReactNode;
}

/** The short name of a voice: `th-TH-Neural2-A` becomes `Neural2-A`. */
function shortVoiceId(voiceName: string, languageCode: string): string {
    const prefix = `${languageCode}-`;
    return voiceName.startsWith(prefix) ? voiceName.slice(prefix.length) : voiceName;
}

/** Google's gender code as a word: `FEMALE` becomes `Female`. */
function genderLabel(gender: string): string {
    if (!gender) return '';
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

/**
 * Voice chooser for the Google Cloud TTS voices of ONE language: every voice
 * Google offers (Standard, WaveNet, Neural2) is listed, and a short preview
 * speaks a sample with the chosen one. When no voice is picked yet the first
 * one is adopted automatically, so speech works without a manual choice.
 *
 * The volume slider stays visible even when the voices cannot be loaded, and
 * the `fallback` slot takes over the voice list in that case.
 *
 * @param props - TtsVoicePicker props.
 * @returns The rendered voice picker.
 */
export default function TtsVoicePicker({ languageCode, fallback }: TtsVoicePickerProps) {
    const { t } = useTranslation();
    const { voices, loading, failed } = useTtsVoices(languageCode);
    const storedVoice = useTtsVoiceStore((state) => state.voices[languageCode] ?? '');
    const setVoice = useTtsVoiceStore((state) => state.setVoice);
    const { volume, setVolume } = useSpeechStore();
    const speakTts = useTtsSpeak();

    /** The pick in use: the learner's one, or the first voice Google offers. */
    const voiceName = resolveVoiceName(voices, storedVoice);

    // Keep the pick usable: a fresh install has none, and Google can drop a
    // voice, so the first voice of the list takes over in both cases.
    useEffect(() => {
        if (!voiceName || voiceName === storedVoice) return;
        setVoice(languageCode, voiceName);
    }, [languageCode, setVoice, storedVoice, voiceName]);

    const options = useMemo(
        () =>
            voices.map((voice) => ({
                value: voice.name,
                label: `${shortVoiceId(voice.name, languageCode)} · ${genderLabel(voice.gender)}`,
            })),
        [languageCode, voices],
    );

    const handleChange = (name: string) => setVoice(languageCode, name);

    const handlePreview = () => {
        if (!voiceName) return;
        speakTts(speechPreviewFor(languageCode), languageCode, voiceName);
    };

    return (
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
            {voices.length > 0 ? (
                <div className='flex items-stretch gap-2'>
                    <div className='min-w-0 flex-1'>
                        <Select
                            options={options}
                            onChange={handleChange}
                            value={voiceName}
                            containerClassName='h-full'
                            className='h-full bg-surface !px-3 !py-0'
                            placeholder={t('common.tts_voice_choose')}
                            icon={<FaVolumeHigh className='w-3 h-3 shrink-0' />}
                        />
                    </div>
                    <button
                        type='button'
                        onClick={handlePreview}
                        title={t('common.tts_voice_preview')}
                        aria-label={t('common.tts_voice_preview')}
                        className='grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-line bg-surface text-surface-muted transition-colors duration-200 hover:border-primary hover:text-primary'
                    >
                        <FaVolumeHigh className='h-3.5 w-3.5' />
                    </button>
                </div>
            ) : failed ? (
                <div className='flex flex-col gap-2'>
                    <p className='text-[11px] font-medium leading-snug text-surface-muted'>
                        {t('common.tts_voice_unavailable')}
                    </p>
                    {fallback}
                </div>
            ) : loading ? (
                <p className='text-[11px] font-medium leading-snug text-surface-muted'>
                    {t('common.loading')}
                </p>
            ) : null}

            <div className='flex items-center gap-4'>
                <FaVolumeHigh className='h-3 w-3 shrink-0 text-surface-muted' />
                <RangeSlider
                    value={volume}
                    min={0}
                    max={1}
                    step={0.01}
                    labelPosition='right'
                    valueFormatter={(v) => `${Math.round(v * 100)}%`}
                    onChange={setVolume}
                    variant='bar'
                    className='min-w-0 flex-1'
                />
            </div>
        </div>
    );
}
