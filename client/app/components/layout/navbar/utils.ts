export type NavItem = { label: string; to: string };

export const getJapaneseNavItems = (t: (key: string) => string): NavItem[] => [
    { label: t('nav.japanese'), to: '/japanese' },
    { label: t('japanese.kana.title'), to: '/japanese/kana' },
    { label: t('japanese.kanaDrill.title'), to: '/japanese/kana-drill' },
    { label: t('japanese.vocabularyReview.title'), to: '/japanese/review' },
    { label: t('japanese.exams.title'), to: '/japanese/exams' },
];

export const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
