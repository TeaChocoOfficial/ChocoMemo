// -Path: 'client/app/components/edit/DeckStatusBar.tsx'
import type { DeckData } from '~/types/deck';
import { useTranslation } from 'react-i18next';
import { useLangText } from '~/hooks/config/useLangText';

/** Props for {@link DeckStatusBar}. */
interface DeckStatusBarProps {
    total: number;
    visible: number;
    selected: DeckData | null;
}

/**
 * VS Code-style status bar for the deck editor: how many decks the explorer is
 * showing on the left, the current selection on the right. Language-agnostic.
 *
 * @param props - Collection totals and the selected deck.
 */
export default function DeckStatusBar({ total, visible, selected }: DeckStatusBarProps) {
    const locale = useLangText();
    const { t } = useTranslation();

    return (
        <div className='flex h-7 shrink-0 items-center justify-between gap-4 border-t border-line bg-primary px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground'>
            <span className='shrink-0'>{t('deck.edit.statusDecks', { visible, total })}</span>
            <span className='truncate'>
                {selected
                    ? `${locale(selected.name)} · ${t(`deck.type.${selected.type}`)}`
                    : t('deck.edit.noneSelected')}
            </span>
        </div>
    );
}
