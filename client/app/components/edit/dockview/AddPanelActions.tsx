// -Path: 'client/app/components/edit/dockview/AddPanelActions.tsx'
import { FaPlus } from 'react-icons/fa6';
import MenuDropdown from '~/components/custom/MenuDropdown';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PANEL_DEFS, type PanelDefinition } from '../panel/panels';
import type { IDockviewHeaderActionsProps } from 'dockview-react';

/** The panels the "+" menu offers; rails are excluded via `addable: false`. */
const ADDABLE = PANEL_DEFS.filter((def) => def.addable !== false);

/**
 * Header "+" action that adds a panel of any registered type. The entries come
 * from the panel registry, so a new dockable component appears here as soon as
 * it is added to `PANEL_DEFS`. Each click adds a fresh instance, docked beside
 * the group's active panel.
 */
export default function AddPanelActions(props: IDockviewHeaderActionsProps) {
    const { t } = useTranslation();
    const menuId = useId();
    const [open, setOpen] = useState(false);
    const countRef = useRef(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // The menu is a bare panel with no dismiss of its own, so leaving it is
    // this component's job: outside click or Escape.
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const add = (def: PanelDefinition) => {
        // A unique id per instance, so adding the same component twice - or
        // alongside the default one - never collides.
        countRef.current += 1;
        const id = `${def.id}-${Date.now().toString(36)}${countRef.current.toString(36)}`;
        const reference = props.activePanel?.id ?? props.panels[0]?.id;

        props.containerApi.addPanel({
            id,
            component: def.id,
            title: t(def.titleKey),
            initialWidth: def.initialWidth,
            minimumWidth: def.minimumWidth,
            maximumWidth: def.maximumWidth,
            position: reference ? { referencePanel: reference, direction: 'right' } : undefined,
        });
        setOpen(false);
    };

    return (
        <div className='relative flex h-full items-center' ref={wrapperRef}>
            <button
                type='button'
                aria-label={t('deck.edit.addPanel')}
                aria-haspopup='menu'
                title={t('deck.edit.addPanel')}
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                onClick={() => setOpen((value) => !value)}
                className='mr-1 flex h-7 w-7 items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-surface-foreground'
            >
                <FaPlus className='h-3.5 w-3.5' />
            </button>

            <MenuDropdown id={menuId} open={open} className='w-52 p-1'>
                {ADDABLE.map((def) => (
                    <button
                        key={def.id}
                        type='button'
                        onClick={() => add(def)}
                        className='block w-full rounded-sm px-3 py-2 text-left text-sm text-surface-foreground transition-colors hover:bg-surface-overlay'
                    >
                        {t(def.titleKey)}
                    </button>
                ))}
            </MenuDropdown>
        </div>
    );
}
