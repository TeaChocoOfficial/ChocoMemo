// -Path: 'client/app/pages/characters/th/components/ThaiClipVoicePicker.tsx'
import { FaVolumeHigh } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Select from '~/components/custom/Select';
import { useSpeak } from '~/hooks/base/useSpeak';
import { useThaiClipStore } from '~/stores/config/thaiClip.store';
import { THAI_CHARS } from '~/data/th/thai';
import { THAI_CLIP_VOICES, thaiClipUrl } from '~/utils/characters/thaiClip';
import type { ThaiClipVoice } from '~/utils/characters/thaiClip';

/** The character the preview button speaks. */
const PREVIEW_CHAR = THAI_CHARS.consonants.headed[0];

/**
 * The offline Thai voice picker: the pre-rendered clips the app ships, used
 * when the server cannot reach Google Cloud TTS. Both clips are real Thai
 * speech, so the chart sounds the same on every device.
 *
 * @returns The rendered clip voice picker.
 */
export default function ThaiClipVoicePicker() {
    const { t } = useTranslation();
    const voice = useThaiClipStore((state) => state.voice);
    const setVoice = useThaiClipStore((state) => state.setVoice);
    const speak = useSpeak('th-TH');

    const options = THAI_CLIP_VOICES.map((id) => ({
        value: id,
        label: t(`thai.character.voice.${id}`),
    }));

    return (
        <div className='flex items-stretch gap-2'>
            <div className='min-w-0 flex-1'>
                <Select
                    options={options}
                    onChange={(value) => setVoice(value as ThaiClipVoice)}
                    value={voice}
                    containerClassName='h-full'
                    className='h-full bg-surface !px-3 !py-0'
                    placeholder={t('common.tts_voice_choose')}
                    icon={<FaVolumeHigh className='w-3 h-3 shrink-0' />}
                />
            </div>
            <button
                type='button'
                onClick={() =>
                    speak(
                        PREVIEW_CHAR.read,
                        thaiClipUrl(PREVIEW_CHAR.sound, voice),
                    )
                }
                title={t('common.tts_voice_preview')}
                aria-label={t('common.tts_voice_preview')}
                className='grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-line bg-surface text-surface-muted transition-colors duration-200 hover:border-primary hover:text-primary'
            >
                <FaVolumeHigh className='h-3.5 w-3.5' />
            </button>
        </div>
    );
}
