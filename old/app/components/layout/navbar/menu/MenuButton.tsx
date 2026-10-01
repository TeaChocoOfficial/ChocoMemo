import { motion } from 'framer-motion';
import { FaSliders } from 'react-icons/fa6';
import type { SetState } from '~/types/type';
import { useTranslation } from 'react-i18next';

export default function MenuButton({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: SetState<boolean>;
}) {
    const { t } = useTranslation();

    return (
        <motion.button
            type='button'
            whileTap={{ scale: 0.96 }}
            title={t('nav.settings')}
            aria-label={t('nav.settings')}
            onClick={() => setOpen((o) => !o)}
            className={`inline-flex items-center justify-center rounded-sm p-2 text-sm transition-colors cursor-pointer ${
                open
                    ? 'bg-surface-overlay text-surface-foreground'
                    : 'text-surface-muted hover:text-surface-foreground hover:bg-surface-overlay'
            }`}
        >
            <FaSliders className='h-4 w-4' />
        </motion.button>
    );
}
