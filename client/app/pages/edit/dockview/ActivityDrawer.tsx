// -Path: 'client/app/pages/edit/dockview/ActivityDrawer.tsx'
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityContent from '../panel/ActivityContent';
import { dockviewApiRef } from '~/stores/edit/dockviewApi.store';

/** Props for {@link ActivityDrawer}. */
interface ActivityDrawerProps {
    open: boolean;
    onClose: () => void;
}

/**
 * The mobile activity sidebar: a left drawer that hosts the same activity
 * content as the docked panel, so the chooser and explorer views stay reachable
 * without a dockview tab. Rendered only while `open`; the backdrop and Escape
 * both close it.
 *
 * @param props - Whether the drawer is open and how to close it.
 * @returns The rendered drawer, or nothing while closed.
 */
export default function ActivityDrawer({ open, onClose }: ActivityDrawerProps) {
    /** Escape closes the drawer, matching the modal pattern. */
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    const api = dockviewApiRef.current;

    return (
        <AnimatePresence>
            {open && (
                <div className='absolute inset-0 z-40'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='absolute inset-0 bg-black/70'
                        onClick={onClose}
                    />

                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.2 }}
                        className='absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-line bg-surface'
                    >
                        {api && <ActivityContent onAdd={onClose} direction='within' />}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}
