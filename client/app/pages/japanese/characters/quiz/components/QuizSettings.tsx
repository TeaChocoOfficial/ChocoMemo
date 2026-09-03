// -Path: 'client/app/pages/japanese/characters/quiz/components/QuizSettings.tsx'
// Settings panel for the character quiz: choose which kana groups to include,
// how many questions, the per-question time limit, and the question mode.
import { FaLayerGroup, FaStopwatch } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Switch from '~/components/custom/Switch';
import RangeSlider from '~/components/custom/RangeSlider';
import VoicePicker from '~/pages/japanese/characters/components/VoicePicker';
import type { KanaSetId } from '~/data/japanese/kana';
import { KANA_CHARS } from '~/data/japanese/kana';
import { motion } from 'framer-motion';
import type { GroupId, QuizMode } from '../hooks/useCharacterQuiz';

export interface QuizSettingsState {
    hiragana: { voiceless: boolean; voiced: boolean; contracted: boolean };
    katakana: { voiceless: boolean; voiced: boolean; contracted: boolean };
    questionCount: number;
    choiceCount: number;
    timeLimit: number;
    autoAdvance: boolean;
    useAll: boolean;
    mode: QuizMode;
}

interface QuizSettingsProps {
    settings: QuizSettingsState;
    onChange: (settings: QuizSettingsState) => void;
}

const GROUPS: { id: GroupId; labelKey: string }[] = [
    { id: 'voiceless', labelKey: 'settings.groups.voiceless' },
    { id: 'voiced', labelKey: 'settings.groups.voiced' },
    { id: 'contracted', labelKey: 'settings.groups.contracted' },
];

const MODES: { id: QuizMode; labelKey: string; hintKey: string }[] = [
    {
        id: 'charToRomaji',
        labelKey: 'japanese.characterQuiz.settings.mode.charToRomaji',
        hintKey: 'japanese.characterQuiz.settings.mode.charToRomajiHint',
    },
    {
        id: 'romajiToChar',
        labelKey: 'japanese.characterQuiz.settings.mode.romajiToChar',
        hintKey: 'japanese.characterQuiz.settings.mode.romajiToCharHint',
    },
    {
        id: 'listenToChar',
        labelKey: 'japanese.characterQuiz.settings.mode.listenToChar',
        hintKey: 'japanese.characterQuiz.settings.mode.listenToCharHint',
    },
];

const groupCount = (set: KanaSetId, group: GroupId): number =>
    KANA_CHARS[set][group].filter((k) => k.char && k.romaji).length;

const totalCount = (s: QuizSettingsState): number => {
    let n = 0;
    (['hiragana', 'katakana'] as KanaSetId[]).forEach((set) => {
        (['voiceless', 'voiced', 'contracted'] as GroupId[]).forEach((group) => {
            if (s[set][group]) n += groupCount(set, group);
        });
    });
    return n;
};

export default function QuizSettings({ settings, onChange }: QuizSettingsProps) {
    const { t } = useTranslation();

    const toggleGroup = (set: KanaSetId, group: GroupId) => {
        onChange({
            ...settings,
            [set]: { ...settings[set], [group]: !settings[set][group] },
        });
    };

    const total = totalCount(settings);

    return (
        <div className='w-full max-w-md mx-auto text-left space-y-8'>
            {/* Sets */}
            <div className='space-y-5'>
                <p className='text-sm font-bold uppercase tracking-widest text-surface-muted flex items-center gap-2'>
                    <FaLayerGroup className='w-3.5 h-3.5' />
                    {t('japanese.characterQuiz.settings.setsLabel')}
                </p>

                {(['hiragana', 'katakana'] as KanaSetId[]).map((set) => (
                    <div key={set} className='rounded-sm border border-line bg-surface p-5'>
                        <p className='text-lg font-bold text-surface-foreground mb-3'>
                            {set === 'hiragana'
                                ? t('japanese.characters.tabs.hiragana')
                                : t('japanese.characters.tabs.katakana')}
                        </p>
                        <div className='space-y-3'>
                            {GROUPS.map((group) => {
                                const count = groupCount(set, group.id);
                                return (
                                    <Switch
                                        key={group.id}
                                        checked={settings[set][group.id]}
                                        label={t(`japanese.characterQuiz.${group.labelKey}`)}
                                        description={`${count} ${t('japanese.characterQuiz.settings.chars')}`}
                                        onCheckedChange={() => toggleGroup(set, group.id)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}

                {total > 0 && (
                    <p className='text-sm text-surface-muted text-center'>
                        {t('japanese.characterQuiz.settings.totalChars')}: {total}
                    </p>
                )}
            </div>

            {/* Quiz options */}
            <div className='rounded-sm border border-line bg-surface p-5 space-y-4'>
                <p className='text-sm font-bold uppercase tracking-widest text-surface-muted flex items-center gap-2'>
                    <FaStopwatch className='w-3.5 h-3.5' />
                    {t('japanese.characterQuiz.settings.questionLabel')}
                </p>

                {/* Question mode */}
                <div className='space-y-2'>
                    <p className='text-sm font-medium text-surface-foreground'>
                        {t('japanese.characterQuiz.settings.modeLabel')}
                    </p>
                    <div className='grid grid-cols-1 gap-2'>
                        {MODES.map((mode) => {
                            const active = settings.mode === mode.id;
                            return (
                                <button
                                    key={mode.id}
                                    type='button'
                                    onClick={() => onChange({ ...settings, mode: mode.id })}
                                    className={`text-left rounded-sm border px-4 py-3 transition-colors duration-200 cursor-pointer ${
                                        active
                                            ? 'border-accent bg-accent/15 text-surface-foreground'
                                            : 'border-line bg-surface-overlay text-surface-foreground hover:border-accent'
                                    }`}
                                >
                                    <span className='block text-sm font-bold'>
                                        {t(mode.labelKey)}
                                    </span>
                                    <span className='block text-xs text-surface-muted mt-0.5'>
                                        {t(mode.hintKey)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {settings.mode === 'listenToChar' && (
                    <div className='space-y-2'>
                        <p className='text-sm font-medium text-surface-foreground'>
                            {t('japanese.characterQuiz.settings.voiceLabel')}
                        </p>
                        <VoicePicker />
                    </div>
                )}

                <Switch
                    checked={settings.useAll}
                    label={t('japanese.characterQuiz.settings.useAll')}
                    onCheckedChange={(useAll) => onChange({ ...settings, useAll })}
                    description={`${total} ${settings.useAll ? t('japanese.characterQuiz.settings.chars') : t('japanese.characterQuiz.settings.questions')}`}
                />

                {!settings.useAll && (
                    <RangeSlider
                        min={1}
                        step={1}
                        max={total || 1}
                        value={Math.min(settings.questionCount, total || 2)}
                        label={t('japanese.characterQuiz.settings.questionCount')}
                        valueFormatter={(v) =>
                            `${v} ${t('japanese.characterQuiz.settings.questions')}`
                        }
                        onChange={(questionCount) => onChange({ ...settings, questionCount })}
                    />
                )}

                <RangeSlider
                    min={2}
                    max={12}
                    step={1}
                    value={settings.choiceCount}
                    label={t('japanese.characterQuiz.settings.choiceCount')}
                    valueFormatter={(v) => `${v} ${t('japanese.characterQuiz.settings.choices')}`}
                    onChange={(choiceCount) => onChange({ ...settings, choiceCount })}
                />

                <RangeSlider
                    min={1}
                    max={20}
                    step={1}
                    value={settings.timeLimit}
                    valueFormatter={(v) => `${v}s`}
                    label={t('japanese.characterQuiz.settings.timeLimit')}
                    onChange={(timeLimit) => onChange({ ...settings, timeLimit })}
                />
                <Switch
                    checked={settings.autoAdvance}
                    label={t('japanese.characterQuiz.settings.autoAdvance')}
                    onCheckedChange={(autoAdvance) => onChange({ ...settings, autoAdvance })}
                />
            </div>
        </div>
    );
}
