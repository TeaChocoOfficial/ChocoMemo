import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { THEMES, useThemeStore, type ThemeName } from '~/stores/theme.store';
import { FaCheck } from 'react-icons/fa6';

export default function ThemeGrid() {
    const { t } = useTranslation();
    const { theme, setTheme } = useThemeStore();

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
            {THEMES.map((item, index) => {
                const active = theme === item.id;
                return (
                    <motion.button
                        key={item.id}
                        type='button'
                        onClick={() => setTheme(item.id as ThemeName)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        aria-pressed={active}
                        aria-label={t(`theme.names.${item.labelKey}`)}
                        className={`group cursor-pointer overflow-hidden rounded-sm border text-left transition-colors ${
                            active
                                ? 'border-accent ring-1 ring-accent'
                                : 'border-line hover:border-line-strong'
                        }`}
                    >
                        <span
                            aria-hidden
                            className='relative block aspect-[4/3] w-full'
                            style={{ background: item.swatch }}
                        >
                            <span
                                className={`absolute top-2 right-2 font-bold leading-none ${
                                    item.dark ? 'text-white/90' : 'text-black/50'
                                }`}
                            >
                                {item.kanji}
                            </span>
                            <span
                                className={`absolute bottom-2 left-2 flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                                    active
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-white/30 text-transparent group-hover:bg-white/50 group-hover:text-white/40'
                                }`}
                            >
                                <FaCheck className='h-2.5 w-2.5' />
                            </span>
                        </span>
                        <span className='block bg-surface px-3 py-2 text-xs font-semibold text-surface-foreground'>
                            {t(`theme.names.${item.labelKey}`)}
                        </span>
                        <span
                            aria-hidden
                            className={`block h-0.5 w-full ${active ? 'bg-accent' : 'bg-transparent'}`}
                        />
                    </motion.button>
                );
            })}
        </div>
    );
}