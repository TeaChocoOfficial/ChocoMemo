// -Path: 'Vite-React-Router-TypeScript/app/components/config/LanguageSwitcher.tsx'
import Select from '../custom/Select';
import { useRouter } from '~/i18n/routing';
import type { Lang } from '~/i18n/locales';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'th-TH', label: 'ไทย', flag: '🇹🇭' },
    { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
    { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
] as const;

export default function LanguageSwitcher() {
    const router = useRouter();
    const { i18n } = useTranslation();

    const languageOptions = languages.map((lang) => ({
        value: lang.code,
        label: lang.label,
        icon: <span className='text-lg leading-none'>{lang.flag}</span>,
    }));

    const handleChange = (value: Lang) => router.switchLocale(value);

    return (
        <Select
            onChange={handleChange}
            options={languageOptions}
            value={i18n.language as Lang}
            className='py-3! px-4! rounded-lg! text-xs'
        />
    );
}
