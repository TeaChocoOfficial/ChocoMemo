// -Path: 'client/src/components/custom/Modal.tsx'
import { useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark } from 'react-icons/fa6';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnBackdrop?: boolean;
    closeOnEsc?: boolean;
    className?: string;
}

export function Modal({
    isOpen,
    onClose,
    children,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEsc = true,
    className = '',
}: ModalProps) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (closeOnEsc && e.key === 'Escape') onClose();
        },
        [closeOnEsc, onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const sizeClass = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-xl',
        xl: 'max-w-2xl',
    }[size];

    return (
        <AnimatePresence>
            {isOpen && (
                // Scrolls on the overlay so a tall dialog can never strand its
                // own content. `items-center` is deliberately NOT used: on a
                // flex container, centering a child taller than the viewport
                // overflows in *both* directions and the top becomes
                // unreachable. The panel's `m-auto` centers it when there is
                // room and degrades to top-aligned when there isn't.
                <div className='fixed inset-0 z-50 flex justify-center overflow-y-auto p-4'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='absolute inset-0 bg-black/70'
                        onClick={closeOnBackdrop ? onClose : undefined}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.18 }}
                        className={`relative m-auto max-h-[calc(100dvh-2rem)] w-full ${sizeClass} overflow-y-auto overscroll-contain bg-surface-elevated border border-line-strong rounded-sm ${className}`}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface ModalHeaderProps {
    title: string;
    icon?: ReactNode;
    onClose?: () => void;
    className?: string;
}

export function ModalHeader({ title, icon, onClose, className = '' }: ModalHeaderProps) {
    return (
        <div
            className={`sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface-elevated px-6 py-4 ${className}`}
        >
            <div className='flex items-center gap-3'>
                {icon && (
                    <div className='flex items-center justify-center w-9 h-9 rounded-sm bg-primary text-primary-foreground'>
                        {icon}
                    </div>
                )}
                <h2 className='text-lg font-semibold text-surface-foreground'>{title}</h2>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className='flex items-center justify-center w-8 h-8 rounded-sm text-surface-muted bg-transparent border-none cursor-pointer hover:bg-surface-overlay hover:text-surface-foreground transition-colors'
                >
                    <FaXmark className='w-4 h-4' />
                </button>
            )}
        </div>
    );
}

interface ModalBodyProps {
    children: ReactNode;
    className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
    return (
        <div
            className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-line ${className}`}
        >
            {children}
        </div>
    );
}
