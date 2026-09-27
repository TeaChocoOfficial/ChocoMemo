import type { Lang } from '~/i18n/locales';

export type SetState<Value> = React.Dispatch<React.SetStateAction<Value>>;

/** for text can be many language */
export type MultiLang = Partial<Record<Lang, string>>;

export type LangText = string | MultiLang;
