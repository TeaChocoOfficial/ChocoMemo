// -Path: 'client/app/components/config/VoicePicker.tsx'
import { useSpeak } from '~/hooks/base/useSpeak';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Select from '~/components/custom/Select';
import RangeSlider from '~/components/custom/RangeSlider';
import { useEffect, useMemo, useState } from 'react';
import { useTargetLang } from '~/hooks/base/useTargetLang';
import { speechPreviewFor } from '~/data/speechPreview';
import { targetSpeechLang } from '~/utils/config/targetLang';
import { useSpeechStore } from '~/stores/config/speech.store';
import { Languages } from '~/data/language';

const AUTO_VALUE = '__auto__';

/** A short sample to preview a voice, per target language. `other` has no
 *  single language, so it uses a neutral sample until a deck supplies one. */
const PREVIEW: Record<Languages, string> = {
    [Languages.ja]: 'あ い う え お',
    [Languages.en]: 'A B C D E',
    [Languages.other]: 'A B C D E',
    [Languages.ko]: '가 나 다 라 마',
    [Languages.th]: 'ก ข ค ง จ',
    [Languages.zh]: '一 二 三 四 五',
};

/**
 * Voice chooser restricted to ONE language: the select only lists installed
 * voices for the target language (a Thai chart offers the Thai male/female
 * voices and nothing else), so a pick can never speak the wrong language.
 * The volume slider stays visible even when no matching voice is installed.
 *
 * @param speechLang BCP47 tag to speak with, overriding the active target
 * language. Deck sessions pass `deck.targetInfo.speechTag` here so an `other`
 * deck previews its own language.
 */
export default function VoicePicker({ speechLang: speechLangProp }: { speechLang?: string } = {}) {
    const speak = useSpeak(speechLangProp);
    const { t } = useTranslation();
    const targetLang = useTargetLang();
    const speechLang = speechLangProp ?? targetSpeechLang(targetLang);
    const { voiceURI, setVoice, volume, setVolume } = useSpeechStore();
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
        loadVoices();
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }, []);

    // Only voices that speak the requested language: a pick made on the Thai
    // chart is a Thai voice, never a leftover from another language.
    const langVoices = useMemo(() => {
        const base = speechLang.toLowerCase().split('-')[0];
        return voices.filter((v) => v.lang.toLowerCase().startsWith(base));
    }, [voices, speechLang]);

    // A stored pick from another language is shown as Auto instead of a
    // phantom option the list does not contain.
    const selectedUri = langVoices.some((v) => v.voiceURI === voiceURI) ? voiceURI : '';

    const options = useMemo(
        () => [
            {
                value: AUTO_VALUE,
                label: `${t('common.voice_auto')} (${speechLang})`,
            },
            ...langVoices.map((v) => ({
                value: v.voiceURI,
                label: `${v.name} (${v.lang})`,
            })),
        ],
        [langVoices, t, speechLang],
    );

    const handleChange = (uri: string) => {
        if (uri === AUTO_VALUE) return setVoice('');
        const voice = langVoices.find((v) => v.voiceURI === uri);
        if (voice) setVoice(voice.voiceURI);
    };

    return (
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
            {langVoices.length > 0 ? (
                <div className='flex items-stretch gap-2'>
                    <div className='min-w-0 flex-1'>
                        <Select
                            options={options}
                            onChange={handleChange}
                            value={selectedUri || AUTO_VALUE}
                            containerClassName='h-full'
                            className='h-full bg-surface px-3! py-0!'
                            placeholder={t('japanese.kana.voice_choose')}
                            icon={<FaVolumeHigh className='w-3 h-3 shrink-0' />}
                        />
                    </div>
                    <button
                        type='button'
                        onClick={() => speak(speechPreviewFor(speechLang))}
                        title={t('japanese.kana.voice_preview')}
                        aria-label={t('japanese.kana.voice_preview')}
                        className='grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-line bg-surface text-surface-muted transition-colors duration-200 hover:border-primary hover:text-primary'
                    >
                        <FaVolumeHigh className='h-3.5 w-3.5' />
                    </button>
                </div>
            ) : (
                <p className='text-[11px] font-medium leading-snug text-surface-muted'>
                    {t('common.voice_missing', { lang: speechLang })}
                </p>
            )}

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
