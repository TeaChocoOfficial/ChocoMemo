// -Path: 'client/app/hooks/editor/useOpenDeckEdit.ts'
import { useCallback } from 'react';
import { PANEL_DEFS } from '~/pages/edit/panel/panels';
import { useOpenPanel } from '~/hooks/editor/useOpenPanel';

/** Registry id of the panel that hosts the deck form. */
const DECK_EDIT_PANEL_ID = 'deckEdit';

/**
 * Brings the deck form panel forward from anywhere in the workspace: it
 * activates the docked panel, or docks it beside the active one when the user
 * closed it. The registry is read inside the callback rather than at module
 * scope, the same way `useOpenPanel` reads the api, so importing this module
 * from a panel the registry itself imports cannot read it half-built.
 *
 * @returns A stable opener for the deck form panel.
 */
export function useOpenDeckEdit() {
    const openPanel = useOpenPanel({ direction: 'within' });

    return useCallback(() => {
        const def = PANEL_DEFS.find((panel) => panel.id === DECK_EDIT_PANEL_ID);
        if (def) openPanel(def);
    }, [openPanel]);
}
