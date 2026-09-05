import { useSpeak } from '~/hooks/useSpeak';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Select from '~/components/custom/Select';
import RangeSlider from '~/components/custom/RangeSlider';
import { useEffect, useMemo, useState } from 'react';
import { useSpeechStore } from '~/stores/speech.store';

const AUTO_VALUE = '__auto__';

export default function VoicePicker() {
    const speak = useSpeak();
    const { t } = useTranslation();
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
                label: `${t('japanese.kana.voice_auto')} (${t('japanese.kana.voice_ja')})`,
            },
            ...voices.map((v) => ({
                value: v.voiceURI,
                label: `${v.name} (${v.lang})`,
            })),
        ],
        [voices, t],
    );

    const handleChange = (uri: string) => {
        if (uri === AUTO_VALUE) return setVoice('', 'ja-JP');
        const voice = voices.find((v) => v.voiceURI === uri);
        if (voice) setVoice(voice.voiceURI, voice.lang);
    };

    if (!voices.length) return null;

    return (
        <div className='flex flex-col gap-2 rounded-sm border border-line bg-surface p-2'>
            <div className='flex flex-wrap items-center gap-2'>
                <Select
                    options={options}
                    onChange={handleChange}
                    value={voiceURI || AUTO_VALUE}
                    containerClassName='min-w-0 flex-1'
                    className='border-none bg-transparent'
                    placeholder={t('japanese.kana.voice_choose')}
                    icon={<FaVolumeHigh className='w-3.5 h-3.5' />}
                />
                <button
                    type='button'
                    onClick={() => speak('あ い う え お')}
                    title={t('japanese.kana.voice_preview')}
                    aria-label={t('japanese.kana.voice_preview')}
                    className='inline-flex items-center justify-center w-10 h-10 rounded-sm bg-accent text-accent-foreground transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis shrink-0'
                >
                    <FaVolumeHigh className='w-4 h-4' />
                </button>
            </div>
            <RangeSlider
                label={t('japanese.kana.voice_volume')}
                value={volume}
                min={0}
                max={1}
                step={0.05}
                valueFormatter={(v) => `${Math.round(v * 100)}%`}
                onChange={setVolume}
                variant='bar'
                className='p-2 pb-4'
            />
        </div>
    );
}
