//-Path: "Vite-React-Router-TypeScript/app/components/config/LanguageSwitcher.tsx"
import Select from '../custom/Select';
import { useRouter } from '~/i18n/routing';
import type { Lang } from '~/i18n/locales';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', label: '한국어', flag: '🇰🇷' },
    { code: 'th-TH', label: 'ไทย', flag: '🇹🇭' },
    { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
    { code: 'vi-VN', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'id-ID', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar-SA', label: 'العربية', flag: '🇸🇦' },
    { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru-RU', label: 'Русский', flag: '🇷🇺' },
    { code: 'it-IT', label: 'Italiano', flag: '🇮🇹' },
    { code: 'tr-TR', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'fil-PH', label: 'Filipino', flag: '🇵🇭' },
    { code: 'ms-MY', label: 'Bahasa Melayu', flag: '🇲🇾' },
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
            className='py-2! px-3! rounded-sm! text-xs'
        />
    );
}