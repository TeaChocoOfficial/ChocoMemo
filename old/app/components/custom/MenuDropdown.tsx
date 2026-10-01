import type { PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type MenuDropdownProps = PropsWithChildren<{
    open: boolean;
    className?: string;
    id?: string;
}>;

export default function MenuDropdown({ open, children, className = '', id }: MenuDropdownProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    id={id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.14, ease: 'easeOut' }}
                    className={`absolute right-0 top-full z-50 mt-1.5 w-64 rounded-sm border border-line bg-surface-elevated shadow-xl shadow-black/8 ${className}`}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}