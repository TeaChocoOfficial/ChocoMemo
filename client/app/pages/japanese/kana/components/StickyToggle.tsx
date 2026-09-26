// -Path: 'client/app/pages/japanese/kana/components/StickyToggle.tsx'
import { motion } from 'framer-motion';
import { FaThumbtack } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

export default function StickyToggle({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}) {
    const { t } = useTranslation();

    return (
        <div
            role='group'
            aria-label={t('japanese.kana.sticky')}
            title={
                enabled ? t('japanese.kana.unpinToolbar') : t('japanese.kana.pinToolbar')
            }
            className='inline-flex items-center rounded-sm border border-line bg-surface-overlay p-1'
        >
            <span className='flex items-center gap-1.5 border-r border-line pr-2 pl-1.5'>
                <FaThumbtack className='h-3.5 w-3.5 text-primary' />
                <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                    {t('japanese.kana.sticky')}
                </span>
            </span>
            <div className='relative ml-1 flex items-center gap-0.5'>
                {([true, false] as const).map((opt) => {
                    const active = enabled === opt;
                    return (
                        <button
                            key={String(opt)}
                            type='button'
                            aria-pressed={active}
                            onClick={() => onChange(opt)}
                            aria-label={
                                opt
                                    ? t('japanese.kana.pinToolbar')
                                    : t('japanese.kana.unpinToolbar')
                            }
                            className={`relative rounded-sm px-2.5 py-1 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                                active
                                    ? 'text-primary-foreground'
                                    : 'text-surface-muted hover:text-surface-foreground'
                            }`}
                        >
                            {active && (
                                <motion.span
                                    layoutId='sticky-toggle-pill'
                                    className='absolute inset-0 rounded-sm bg-primary'
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className='relative z-10'>
                                {opt
                                    ? t('japanese.kana.stickyOn')
                                    : t('japanese.kana.stickyOff')}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
