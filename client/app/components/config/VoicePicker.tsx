import { useSpeak } from '~/hooks/base/useSpeak';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Select from '~/components/custom/Select';
import RangeSlider from '~/components/custom/RangeSlider';
import { useEffect, useMemo, useState } from 'react';
import { useTargetLang } from '~/hooks/base/useTargetLang';
import { Languages } from '~/data/language';
import { targetSpeechLang } from '~/utils/config/targetLang';
import { useSpeechStore } from '~/stores/config/speech.store';

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

    const options = useMemo(
        () => [
            {
                value: AUTO_VALUE,
                label: `${t('japanese.kana.voice_auto')} (${speechLang})`,
            },
            ...voices.map((v) => ({
                value: v.voiceURI,
                label: `${v.name} (${v.lang})`,
            })),
        ],
        [voices, t, speechLang],
    );

    const handleChange = (uri: string) => {
        if (uri === AUTO_VALUE) return setVoice('', speechLang);
        const voice = voices.find((v) => v.voiceURI === uri);
        if (voice) setVoice(voice.voiceURI, voice.lang);
    };

    if (!voices.length) return null;

    return (
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
            <div className='flex items-stretch gap-2'>
                <div className='min-w-0 flex-1'>
                    <Select
                        options={options}
                        onChange={handleChange}
                        value={voiceURI || AUTO_VALUE}
                        containerClassName='h-full'
                        className='h-full bg-surface !px-3 !py-0'
                        placeholder={t('japanese.kana.voice_choose')}
                        icon={<FaVolumeHigh className='w-3 h-3 shrink-0' />}
                    />
                </div>
                <button
                    type='button'
                    onClick={() => speak(PREVIEW[targetLang])}
                    title={t('japanese.kana.voice_preview')}
                    aria-label={t('japanese.kana.voice_preview')}
                    className='grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-line bg-surface text-surface-muted transition-colors duration-200 hover:border-primary hover:text-primary'
                >
                    <FaVolumeHigh className='h-3.5 w-3.5' />
                </button>
            </div>

            <div className='flex items-center gap-2'>
                <FaVolumeHigh className='h-3 w-3 shrink-0 text-surface-muted' />
                <RangeSlider
                    label={t('japanese.kana.voice_volume')}
                    value={volume}
                    min={0}
                    max={1}
                    step={0.05}
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