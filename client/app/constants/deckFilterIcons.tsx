// -Path: 'client/app/constants/deckFilterIcons.tsx'
import {
    FaBook,
    FaBookOpen,
    FaUsers,
    FaCloud,
    FaHardDrive,
    FaCircleCheck,
    FaLayerGroup,
    FaClockRotateLeft,
    FaClipboardCheck,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { DeckFilter, DeckSource } from '~/types/deck';

/** Icon per type filter, so the explorer picker reads at a glance. */
export const FILTER_ICONS: Record<DeckFilter, IconType> = {
    all: FaLayerGroup,
    vocab: FaBook,
    render: FaBookOpen,
    review: FaClockRotateLeft,
    exam: FaClipboardCheck,
};

/** Icon per deck source, matching the tally and the deck cards. */
export const SOURCE_ICONS: Record<DeckSource, IconType> = {
    local: FaHardDrive,
    official: FaCircleCheck,
    cloud: FaCloud,
    community: FaUsers,
};
