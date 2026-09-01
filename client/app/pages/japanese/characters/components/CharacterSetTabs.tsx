// -Path: 'client/app/pages/japanese/characters/components/CharacterSetTabs.tsx'
import { motion } from 'framer-motion';
import type { KanaSetId } from '~/data/japanese/kana';
import { KANA_SET_IDS } from '~/data/japanese/kana';

interface CharacterSetTabsProps {
    active: KanaSetId;
    onChange: (set: KanaSetId) => void;
    labels: Record<KanaSetId, string>;
}

export default function CharacterSetTabs({ active, onChange, labels }: CharacterSetTabsProps) {
    return (
        <div className='inline-flex items-center gap-1 p-1 rounded-sm bg-surface-overlay border border-line'>
            {KANA_SET_IDS.map((set) => {
                const isActive = set === active;
                return (
                    <button
                        key={set}
                        type='button'
                        onClick={() => onChange(set)}
                        className={`relative px-5 py-2 text-sm font-semibold rounded-sm transition-colors duration-200 cursor-pointer ${
                            isActive
                                ? 'text-accent-foreground'
                                : 'text-surface-muted hover:text-surface-foreground'
                        }`}
                    >
                        {isActive && (
                            <motion.span
                                layoutId='character-set-tab'
                                className='absolute inset-0 rounded-sm bg-accent'
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className='relative z-10'>{labels[set]}</span>
                    </button>
                );
            })}
        </div>
    );
}
