// -Path: 'client/app/components/container/DeckList/DeckListActions.tsx'
// Which add/import affordances a given deck-list page can honestly offer.
//
// Not every page can offer every action, and offering one that quietly does
// nothing is worse than offering none: a viewer who composes a deck and then
// cannot find it in the list they made it on will assume the app lost it. So
// this resolves capabilities per (language, type) instead of hiding failures
// behind disabled buttons.
//
// The table is deliberately boring. Adding a track means adding a row here,
// not threading another condition through the options bar.
import type { ReactNode } from 'react';
import { Languages } from '~/data/language';
import type { DeckType } from '~/types/deck';
import { useTranslation } from 'react-i18next';
import { FaLayerGroup } from 'react-icons/fa6';
import DeckImportButton from './DeckImportButton';

/** The controls the options bar renders for a page that can add to its list. */
export interface DeckListActions {
    /** Label and icon for the trigger that opens `create`. Only read when
     *  `create` is set. */
    createLabel: string;
    createIcon: ReactNode;
    /** The import control, or `null` where the page has no supported file
     *  format — an import row that always rejects is worse than no row. */
    import: ReactNode | null;
}

/** Deck types a `.json` file can be imported as today. Vocabulary decks and
 *  exam sets each have a schema under `utils/`; reading decks have no file
 *  format yet. */
const IMPORTABLE: readonly DeckType[] = ['vocab', 'exam'];

/**
 * @returns The actions for this page, or `null` when it has neither a compose
 * route nor an import format — the options bar then renders no action control
 * at all, rather than a menu with nothing in it.
 */
export function useDeckListActions(language: Languages, type: DeckType): DeckListActions | null {
    const { t } = useTranslation();

    const canImport = IMPORTABLE.includes(type);
    // Composing a deck means picking words out of a word bank, and only the
    // Japanese track ships one. New tracks get import first and a compose flow
    // when their vocabulary store exists.
    const canCreate = language === Languages.ja && (type === 'vocab' || type === 'exam');

    if (!canImport && !canCreate) return null;

    return {
        createLabel: canCreate ? t(`deck.actions.create.${type}`) : t('deck.actions.importOnly'),
        createIcon: <FaLayerGroup className='h-3.5 w-3.5' />,
        import: canImport ? <DeckImportButton language={language} type={type} /> : null,
    };
}
