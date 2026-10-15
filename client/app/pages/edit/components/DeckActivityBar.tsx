// -Path: 'client/app/components/edit/DeckActivityBar.tsx'
import {
    FaLayerGroup,
    FaBookOpen,
    FaArrowsRotate,
    FaClipboardCheck,
    FaBookOpenReader,
} from 'react-icons/fa6';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { DeckFilter } from '../../../hooks/edito/useDeckEditor';

/** Props for {@link DeckActivityBar}. */
interface DeckActivityBarProps {
    value: DeckFilter;
    onChange: (value: DeckFilter) => void;
    counts: Record<DeckFilter, number>;
    /** Vertical rail on desktop, horizontal strip on mobile. */
    direction?: 'vertical' | 'horizontal';
}

/** One filter button: which decks it keeps, and the glyph on the rail. */
interface FilterItem {
    id: DeckFilter;
    icon: ReactNode;
}

const ITEMS: FilterItem[] = [
    { id: 'all', icon: <FaLayerGroup className='h-4 w-4' /> },
    { id: 'vocab', icon: <FaBookOpen className='h-4 w-4' /> },
    { id: 'render', icon: <FaBookOpenReader className='h-4 w-4' /> },
    { id: 'review', icon: <FaArrowsRotate className='h-4 w-4' /> },
    { id: 'exam', icon: <FaClipboardCheck className='h-4 w-4' /> },
];

/**
 * VS Code-style activity rail: one icon per explorer filter, the active one
 * marked with the accent colour and a bar. Language-agnostic — the labels are
 * the shared `deck.type.*` names, so every track reuses the same rail.
 *
 * @param props - The active filter, its change sink, and per-type counts.
 */
export default function DeckActivityBar({
    value,
    onChange,
    counts,
    direction = 'vertical',
}: DeckActivityBarProps) {
    const { t } = useTranslation();
    const isVertical = direction === 'vertical';

    return (
        <nav
            aria-label={t('deck.edit.filters')}
            className={`flex shrink-0 gap-1 bg-surface-sunken p-1.5 ${
                isVertical
                    ? 'flex-col items-center border-r border-line'
                    : 'flex-row items-center overflow-x-auto border-b border-line'
            }`}
        >
            {ITEMS.map((item) => {
                const active = item.id === value;
                const label =
                    item.id === 'all' ? t('deck.edit.filterAll') : t(`deck.type.${item.id}`);

                return (
                    <button
                        key={item.id}
                        type='button'
                        title={label}
                        aria-label={label}
                        aria-pressed={active}
                        onClick={() => onChange(item.id)}
                        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-sm transition-colors ${
                            active
                                ? 'bg-surface-overlay text-primary'
                                : 'text-surface-muted hover:bg-surface-overlay hover:text-surface-foreground'
                        }`}
                    >
                        {item.icon}
                        <span className='absolute bottom-0.5 right-1 font-mono text-[10px] leading-none text-surface-muted'>
                            {counts[item.id]}
                        </span>
                        {active && isVertical && (
                            <span className='absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary' />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
