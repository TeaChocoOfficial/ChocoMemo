import Select from '../custom/Select';
import { useTranslation } from 'react-i18next';
import { THEMES, useThemeStore, type ThemeName } from '~/stores/theme.store';

export default function ThemePicker() {
    const { t } = useTranslation();
    const { theme, setTheme } = useThemeStore();

    const themeOptions = THEMES.map((item) => ({
        value: item.id,
        label: t(`theme.names.${item.labelKey}`),
        icon: (
            <span
                aria-hidden
                className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong text-[10px] font-bold leading-none'
                style={{ background: item.swatch, color: item.dark ? '#fff' : '#333' }}
            >
                {item.kanji}
            </span>
        ),
    }));

    const handleChange = (id: ThemeName) => setTheme(id);

    return (
        <Select
            value={theme}
            options={themeOptions}
            onChange={handleChange}
            optionsClassName='right-0!'
            className='py-2! px-3! rounded-sm! text-xs'
        />
    );
}
