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
                    onClick={() => speak('あ い う え お')}
                    title={t('japanese.kana.voice_preview')}
                    aria-label={t('japanese.kana.voice_preview')}
                    className='grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-line bg-surface text-surface-muted transition-colors duration-200 hover:border-accent hover:text-accent'
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