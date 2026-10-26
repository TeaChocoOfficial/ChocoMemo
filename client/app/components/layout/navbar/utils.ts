// -Path: 'client/app/components/layout/navbar/utils.ts'
import type { IconType } from 'react-icons';
import { FaBookOpen, FaGraduationCap, FaHouse, FaPenToSquare } from 'react-icons/fa6';

export type NavItem = {
    to: string;
    label: string;
    icon: IconType;
    /** Extra path prefixes that also count as this item being active, so a
     *  feature page (e.g. `/vocab`) keeps its parent section highlighted. */
    activeFor?: string[];
};

/** Top-level destinations in the navbar, desktop and mobile alike. */
export const getPrimaryNavItems = (): NavItem[] => [
    { to: '/', label: 'nav.home', icon: FaHouse },
    { to: '/guide', label: 'nav.guide', icon: FaBookOpen },
    {
        to: '/study',
        label: 'nav.study',
        icon: FaGraduationCap,
        activeFor: [
            '/study',
            '/characters',
            '/drill',
            '/decks',
            '/vocab',
            '/review',
            '/render',
            '/exam',
        ],
    },
    { to: '/edit', label: 'nav.edit', icon: FaPenToSquare },
];

/** Whether a nav item should read as active for the current pathname. */
export const isNavItemActive = (item: NavItem, pathname: string): boolean => {
    const prefixes = item.activeFor ?? [item.to];
    return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
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
