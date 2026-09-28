import type { IconType } from 'react-icons';
import {
    FaArrowsRotate,
    FaBolt,
    FaBookOpen,
    FaBookOpenReader,
    FaChartSimple,
    FaClipboardCheck,
    FaGlobe,
    FaHouse,
} from 'react-icons/fa6';
import { Languages, languages } from '~/data/language';

export type NavItem = {
    label: string;
    to: string;
    icon: IconType;
    /** Set for a track hub, which shows its native glyph instead of an
     *  icon. Feature links leave it undefined. */
    glyph?: string;
};

/** Top-level links shown before the per-track dropdowns. */
export const getPrimaryNavItems = (t: (key: string) => string): NavItem[] => [
    { label: t('nav.home'), to: '/', icon: FaHouse },
    { label: t('nav.languages'), to: '/language-select', icon: FaGlobe },
];

type Translate = (key: string) => string;

/** Feature links for one track, in learn-then-practice order.
 *
 * `type` matches `DeckType`, so a link can be handed straight to `DecksList`
 * and the i18n namespace `${language}.${type}` lines up with the list copy. */
function featureItems(language: Languages, t: Translate): NavItem[] {
    const prefix = language === Languages.ja ? 'japanese' : 'english';
    const item = (type: string, to: string, icon: IconType): NavItem => ({
        label: t(`${prefix}.${type}.title`),
        to,
        icon,
    });

    return language === Languages.ja
        ? [
              item('kana', '/japanese/kana', FaChartSimple),
              item('vocab', '/japanese/vocabulary', FaBookOpen),
              item('render', '/japanese/render', FaBookOpenReader),
              item('drill', '/japanese/drill', FaBolt),
              item('review', '/japanese/review', FaArrowsRotate),
              item('exam', '/japanese/exam', FaClipboardCheck),
          ]
        : [
              item('vocab', '/english/vocabulary', FaBookOpen),
              item('render', '/english/render', FaBookOpenReader),
              item('review', '/english/review', FaArrowsRotate),
              item('exam', '/english/exam', FaClipboardCheck),
          ];
}

/** A track's dropdown contents: its hub, then its features. */
export const getTrackNavItems = (language: Languages, t: Translate): NavItem[] => {
    const hub = language === Languages.ja ? t('nav.japanese') : t('nav.english');
    const glyph = languages.find((l) => l.id === language)?.glyph;
    return [{ label: hub, to: `/${language}`, icon: FaGlobe, glyph }, ...featureItems(language, t)];
};

export const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
