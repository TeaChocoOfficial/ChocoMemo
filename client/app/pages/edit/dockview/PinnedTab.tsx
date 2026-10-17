// -Path: 'client/app/pages/edit/dockview/PinnedTab.tsx'
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createCloseButton, createPinButton } from 'dockview-react';
import { usePinnedTabsStore } from '~/stores/config/pinnedTabs.store';
import type { PointerEvent, SyntheticEvent } from 'react';
import type { DockviewPanelApi, IDockviewPanelHeaderProps } from 'dockview-react';

/**
 * Tracks a panel's title, re-syncing when the panel's title changes.
 *
 * @param api - The panel api whose title is tracked.
 * @returns The current title.
 */
function useTabTitle(api: DockviewPanelApi): string | undefined {
    const [title, setTitle] = useState(api.title);

    useEffect(() => {
        const disposable = api.onDidTitleChange((event) => setTitle(event.title));
        if (title !== api.title) setTitle(api.title);
        return () => disposable.dispose();
    }, [api]);

    return title;
}

/**
 * The tab header for the editor workspace. It mirrors dockview's default tab
 * but reads the pinned state from the app store, because the free dockview
 * build has no pinned-tabs module (`api.isPinned` is always false).
 *
 * A pinned tab is not closable: it renders no close button and ignores the
 * middle-click shortcut, so the only way out is to unpin it first.
 *
 * @param props - The dockview panel header props.
 * @returns The rendered tab header.
 */
export default function PinnedTab({ api }: IDockviewPanelHeaderProps) {
    const { t } = useTranslation();
    const title = useTabTitle(api);
    const isPinned = usePinnedTabsStore((state) => state.pinnedIds.includes(api.id));
    const middleClick = useRef(false);
    const pinRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    /** Closes the panel. A pinned tab is left alone. */
    const onClose = (event: SyntheticEvent) => {
        event.preventDefault();
        if (isPinned) return;
        api.close();
    };

    /** Records whether the press was the middle mouse button. */
    const onPointerDown = (event: PointerEvent) => {
        middleClick.current = event.button === 1;
    };

    /** Closes the panel when it was a middle-click release. */
    const onPointerUp = (event: PointerEvent) => {
        if (middleClick.current && event.button === 1) {
            middleClick.current = false;
            onClose(event);
        }
    };

    /** Clears the middle-click flag when the pointer leaves the tab. */
    const onPointerLeave = () => {
        middleClick.current = false;
    };

    // The pin and close glyphs are DOM factories, not React components, so they
    // are appended to their hosts once the hosts exist.
    useEffect(() => {
        const pin = pinRef.current;
        const close = closeRef.current;
        if (pin && !pin.hasChildNodes()) pin.appendChild(createPinButton());
        if (close && !close.hasChildNodes()) close.appendChild(createCloseButton());
    }, [isPinned]);

    return (
        <div
            data-testid='dockview-dv-default-tab'
            onPointerUp={onPointerUp}
            onPointerDown={onPointerDown}
            onPointerLeave={onPointerLeave}
            className='dv-default-tab'
        >
            {isPinned && (
                <div
                    ref={pinRef}
                    title={t('deck.edit.unpinTab')}
                    aria-label={t('deck.edit.unpinTab')}
                    className='dv-tab-pin mr-1 shrink-0 opacity-70'
                >
                    {/** The pin glyph is appended here by the effect above. */}
                </div>
            )}
            <span className='dv-default-tab-content'>{title}</span>
            {!isPinned && (
                <button
                    type='button'
                    ref={closeRef}
                    onClick={onClose}
                    aria-label={t('deck.edit.closeTab')}
                    className='dv-default-tab-action'
                    onPointerDown={(event) => event.preventDefault()}
                >
                    {/** The close glyph is appended here by the effect above. */}
                </button>
            )}
        </div>
    );
}
