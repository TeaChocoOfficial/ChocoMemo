// -Path: 'client/app/pages/characters/components/ReadingVolume.tsx'
import { useTranslation } from 'react-i18next';
import { FaVolumeHigh } from 'react-icons/fa6';
import Select from '~/components/custom/Select';
import RangeSlider from '~/components/custom/RangeSlider';
import { CHARACTER_CLIP_VOICES } from '~/utils/characters/characterClip';
import { useCharacterToolbar } from '~/hooks/characters/useCharacterToolbar';

/**
 * The right half of the toolbar's console: the chart's voice, a preview button
 * that speaks the first character of the active group, and the reading volume.
 * The preview goes through the same `speak` as a card tap, so it shows exactly
 * what the learner will hear.
 *
 * @returns The rendered voice and volume controls.
 */
export default function ReadingVolume() {
    const { t } = useTranslation();
    const { items, speak, voice, volume, setVoice, setVolume } = useCharacterToolbar();

    const preview = items.find((item) => item.char);
    const options = CHARACTER_CLIP_VOICES.map((id) => ({
        value: id,
        label: t(`characters.voice.${id}`),
    }));

    return (
        <div className='flex flex-col justify-center gap-2 rounded-sm bg-surface-overlay p-3 md:w-72 sm:shrink-0 md:p-3.5'>
            <div className='flex items-stretch gap-2'>
                <Select
                    value={voice}
                    options={options}
                    onChange={(voice) => setVoice(voice)}
                    placeholder={t('common.voice_choose')}
                    containerClassName='flex-1 min-h-full min-w-0'
                    className='h-full bg-surface px-3! py-0!'
                    icon={<FaVolumeHigh className='w-3 h-3 shrink-0' />}
                />
                <button
                    type='button'
                    disabled={!preview}
                    onClick={() => preview && speak(preview.sound)}
                    title={t('common.voice_preview')}
                    aria-label={t('common.voice_preview')}
                    className='grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-line bg-surface text-surface-muted transition-colors duration-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50'
                >
                    <FaVolumeHigh className='h-3.5 w-3.5' />
                </button>
            </div>
            <div className='flex items-center gap-4'>
                <FaVolumeHigh className='h-3 w-3 shrink-0 text-surface-muted' />
                <RangeSlider
                    min={0}
                    max={1}
                    step={0.01}
                    variant='bar'
                    value={volume}
                    onChange={setVolume}
                    labelPosition='right'
                    className='min-w-0 flex-1'
                    valueFormatter={(v) => `${Math.round(v * 100)}%`}
                />
            </div>
        </div>
    );
}
