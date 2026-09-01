// -Path: 'Vite-React-Router-TypeScript/app/components/config/LanguageSwitcher.tsx'
import Select from '../custom/Select';
import { useRouter } from '~/i18n/routing';
import type { Lang } from '~/i18n/locales';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en-US', label: 'English', short: 'EN' },
    { code: 'th-TH', label: 'ไทย', short: 'TH' },
    { code: 'ja-JP', label: '日本語', short: 'JA' },
    { code: 'zh-CN', label: '中文', short: 'ZH' },
] as const;

export default function LanguageSwitcher() {
    const router = useRouter();
    const { i18n } = useTranslation();

    const languageOptions = languages.map((lang) => ({
        value: lang.code,
        label: lang.label,
        icon: (
            <span className='flex h-5 w-7 shrink-0 items-center justify-center border border-line text-[9px] font-mono font-semibold leading-none text-surface-subtle'>
                {lang.short}
            </span>
        ),
    }));

    const handleChange = (value: Lang) => router.switchLocale(value);

    return (
        <Select
            onChange={handleChange}
            options={languageOptions}
            value={i18n.language as Lang}
            className='py-2! px-3! rounded-sm! text-xs'
        />
    );
}
