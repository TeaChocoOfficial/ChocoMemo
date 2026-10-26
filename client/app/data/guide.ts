// -Path: 'client/app/data/guide.ts'
import {
    FaClipboardList,
    FaFilePen,
    FaGraduationCap,
    FaHouse,
    FaLanguage,
    FaLayerGroup,
    FaMicrophone,
    FaUserGroup,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';

/** The guide's quick-start steps, in order. Each one links to a real route. */
export interface GuideStep {
    /** i18n key suffix under `guide.steps`. */
    id: string;
    /** Where the step sends the reader. */
    to: string;
    icon: IconType;
}

/**
 * The four moves a new learner makes, in the order they make them. The guide
 * opens with them because a tour that starts with every feature at once reads
 * like a manual; a tour that starts with "pick a language, open a deck, drill,
 * review" reads like a first session.
 */
export const guideSteps: GuideStep[] = [
    { id: 'step1', to: '/', icon: FaHouse },
    { id: 'step2', to: '/characters/ja', icon: FaLanguage },
    { id: 'step3', to: '/drill/ja', icon: FaGraduationCap },
    { id: 'step4', to: '/review', icon: FaClipboardList },
];

/** One area of the app the guide explains. */
export interface GuideSection {
    /** i18n key suffix under `guide.sections`. */
    id: string;
    /** Where the section's own page lives. */
    to: string;
    icon: IconType;
    /** How many bullet points the section has (`point1` … `pointN`). */
    points: number;
    /** Marks a section that is announced but not live yet. */
    soon?: boolean;
}

/**
 * The guide's sections: one card per area of the app, in the order a learner
 * meets them. `points` mirrors the bullet count in `en.json` so the copy and
 * the markup can never drift apart.
 */
export const guideSections: GuideSection[] = [
    { id: 'landing', to: '/', icon: FaHouse, points: 3 },
    { id: 'hub', to: '/study', icon: FaGraduationCap, points: 3 },
    { id: 'charts', to: '/characters/ja', icon: FaLanguage, points: 4 },
    { id: 'drill', to: '/drill/ja', icon: FaGraduationCap, points: 4 },
    { id: 'decks', to: '/vocab', icon: FaLayerGroup, points: 4 },
    { id: 'edit', to: '/edit', icon: FaFilePen, points: 3 },
    { id: 'voice', to: '/settings', icon: FaMicrophone, points: 3 },
    { id: 'account', to: '/auth', icon: FaUserGroup, points: 3 },
];
