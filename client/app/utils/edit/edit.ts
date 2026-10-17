// -Path: 'client/app/components/edit/utils.ts'
import { resolveText } from '~/hooks/config/useLangText';
import type { LangText, MultiLang } from '~/types/type';
import { SUPPORTED_LANGS, type Lang } from '~/i18n/locales';

/** The supported locale whose subtag matches a raw i18n language string. */
function localeKey(language: string): Lang {
    const base = language.toLowerCase().split('-')[0];
    return SUPPORTED_LANGS.find((lang) => lang.toLowerCase().startsWith(base)) ?? 'en';
}

/** Reads the current locale's slot of a `LangText`, resolving fallbacks. */
export function readLangText(text: LangText | undefined, language: string): string {
    if (text == null) return '';
    return resolveText(text, language);
}

/** Writes an edited string into the current locale slot, preserving the rest. */
export function writeLangText(
    text: LangText | undefined,
    language: string,
    value: string,
): LangText {
    const base: MultiLang = typeof text === 'object' && text !== null ? { ...text } : {};
    return { ...base, [localeKey(language)]: value };
}

/** Turns a comma-separated field into a trimmed, de-duplicated tag list. */
export function parseTags(text: string): string[] {
    const tags = text
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    return [...new Set(tags)];
}
