import type { Lang } from '~/i18n/locales';

/** for text can be many language */
export type LangText = string | Partial<Record<Lang, string>>;
