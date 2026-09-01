// -Path: 'Vite-React-TypeScript/src/pages/auth/AuthDataPanel.tsx'
import { motion } from 'framer-motion';
import type { Message } from '../../type';
import { useTranslation } from 'react-i18next';
import { JsonViewer } from '@textea/json-viewer';
import { useAuthStore } from '~/stores/auth.store';
import { useThemeStore } from '~/stores/theme.store';
import { FaCode, FaCopy, FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';

interface AuthDataPanelProps {
    message: Message | null;
}

export default function AuthDataPanel({ message }: AuthDataPanelProps) {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();

    const handleCopy = () => navigator.clipboard.writeText(JSON.stringify(user, null, 2));

    return (
        <>
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                        <FaCode className='w-5 h-5' />
                    </div>
                    <h2 className='text-xl font-bold text-surface-foreground'>
                        {t('auth.data_title')}
                    </h2>
                </div>
                <button className='btn btn-primary-ghost rounded-full p-2.5' onClick={handleCopy}>
                    <FaCopy className='w-4 h-4' />
                </button>
            </div>

            {message && (
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    className={`rounded-xl p-4 mb-5 border ${
                        message.type === 'success'
                            ? 'bg-success-subtle border-success/20 text-success'
                            : 'bg-error-subtle border-error/20 text-error'
                    }`}
                >
                    <div className='flex items-center gap-2'>
                        {message.type === 'success' ? (
                            <FaCircleCheck className='w-4 h-4 shrink-0' />
                        ) : (
                            <FaCircleXmark className='w-4 h-4 shrink-0' />
                        )}
                        <span className='text-sm font-medium'>{message.text}</span>
                    </div>
                </motion.div>
            )}

            <div className='rounded-xl border border-border bg-surface-overlay/50 overflow-hidden'>
                <div className='p-3 max-h-96 overflow-y-auto'>
                    <JsonViewer
                        value={user}
                        rootName={false}
                        defaultInspectDepth={5}
                        enableClipboard={false}
                        displayDataTypes={false}
                        theme={theme === 'dark' ? 'dark' : 'light'}
                    />
                </div>
            </div>
        </>
    );
}
