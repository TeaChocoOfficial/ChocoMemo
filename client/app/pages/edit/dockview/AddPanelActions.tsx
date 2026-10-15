// -Path: 'client/app/components/edit/dockview/AddPanelActions.tsx'
import { FaPlus } from 'react-icons/fa6';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PANEL_DEFS, type PanelDefinition } from '../panel/panels';
import type { IDockviewHeaderActionsProps } from 'dockview-react';

/** Gap between the trigger and the menu, in pixels. */
const MENU_GAP = 6;
/** The menu's width, in pixels — must match the `w-52` class below. */
const MENU_WIDTH = 208;
/** Minimum distance the menu keeps from the viewport edges, in pixels. */
const VIEWPORT_PAD = 8;

/**
 * Header "+" action that adds a panel of any registered type. The entries come
 * from the panel registry, so a new dockable component appears here as soon as
 * it is added to `PANEL_DEFS`. Each click adds a fresh instance as a tab in the
 * group's active panel, rather than as a new column.
 *
 * The menu is portalled to `<body>`: a dockview group clips its overflow, so an
 * in-place dropdown would be cut off at the header.
 */
export default function AddPanelActions(props: IDockviewHeaderActionsProps) {
    const menuId = useId();
    const countRef = useRef(0);
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

    // Read the registry inside the component: `panels.tsx` imports this file's
    // siblings, so touching `PANEL_DEFS` at module scope risks a circular-import
    // read before the registry is initialized.
    const addable = PANEL_DEFS.filter((def) => def.addable !== false);

    /** Opens the menu below the trigger, or closes it when already open. */
    const toggle = () => {
        if (open) return setOpen(false);
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (rect) {
            // Left-align to the trigger, then clamp so the menu never runs off
            // the right or left edge of the viewport.
            const left = Math.max(
                VIEWPORT_PAD,
                Math.min(rect.left, window.innerWidth - MENU_WIDTH - VIEWPORT_PAD),
            );
            setPos({ top: rect.bottom + MENU_GAP, left });
        }
        setOpen(true);
    };

    // The menu is a bare panel with no dismiss of its own, so leaving it is
    // this component's job: outside click or Escape. The menu lives in a portal,
    // so both the trigger and the menu count as "inside".
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!wrapperRef.current?.contains(target) && !menuRef.current?.contains(target)) {
                setOpen(false);
            }
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
            position: reference ? { referencePanel: reference, direction: 'within' } : undefined,
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
                onClick={toggle}
                className='mr-1 flex h-7 w-7 items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-surface-foreground'
            >
                <FaPlus className='h-3.5 w-3.5' />
            </button>

            {typeof document !== 'undefined' &&
                createPortal(
                    <AnimatePresence>
                        {open && pos && (
                            <motion.div
                                id={menuId}
                                ref={menuRef}
                                exit={{ opacity: 0, y: 6 }}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.14, ease: 'easeOut' }}
                                style={{ position: 'fixed', top: pos.top, left: pos.left }}
                                className='z-50 w-52 rounded-sm border border-line bg-surface-elevated p-1 shadow-xl shadow-black/8'
                            >
                                {addable.map((def) => (
                                    <button
                                        key={def.id}
                                        type='button'
                                        onClick={() => add(def)}
                                        className='block w-full rounded-sm px-3 py-2 text-left text-sm text-surface-foreground transition-colors hover:bg-surface-overlay'
                                    >
                                        {t(def.titleKey)}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    );
}
