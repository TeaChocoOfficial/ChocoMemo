import Select from '../custom/Select';
import { useTranslation } from 'react-i18next';
import { THEMES, useThemeStore, type ThemeName } from '~/stores/theme.store';

export default function ThemePicker() {
    const { t } = useTranslation();
    const { theme, setTheme } = useThemeStore();

    const themeOptions = THEMES.map((item) => {
        const Icon = item.icon;
        return {
            value: item.id,
            label: t(`theme.names.${item.labelKey}`),
            icon: (
                <span
                    aria-hidden
                    className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong'
                    style={{ background: item.swatch, color: item.dark ? '#fff' : '#333' }}
                >
                    <Icon className='h-3.5 w-3.5' />
                </span>
            ),
        };
    });

    const handleChange = (id: ThemeName) => setTheme(id);

    return (
        <Select
            value={theme}
            options={themeOptions}
            onChange={handleChange}
            className='py-2! px-3! rounded-sm! text-xs'
        />
    );
}
