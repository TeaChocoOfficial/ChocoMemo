// -Path: 'Vite-React-TypeScript/src/pages/socket/ConnectionStatus.tsx'
import { motion } from 'framer-motion';
import { FaPlug } from 'react-icons/fa6';
import Card from '~/components/custom/Card';
import Badge from '~/components/custom/Badge';
import type { Socket } from 'socket.io-client';
import { useTranslation } from 'react-i18next';

interface ConnectionStatusProps {
    socket: Socket | null;
    isConnected: boolean;
}

export default function ConnectionStatus({ socket, isConnected }: ConnectionStatusProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card
                className='h-full'
                title={t('socket.status')}
                icon={<FaPlug className='w-5 h-5' />}
            >
                <div className='mt-4 space-y-3'>
                    <div className='flex items-center justify-between rounded-xl bg-surface-overlay/50 px-4 py-3'>
                        <span className='text-sm text-surface-subtle'>{t('socket.status')}</span>
                        <Badge variant={isConnected ? 'success' : 'error'}>
                            <span
                                className={`inline-block w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`}
                            />
                            {isConnected ? t('socket.connected') : t('socket.disconnected')}
                        </Badge>
                    </div>
                    <div className='flex items-center justify-between rounded-xl bg-surface-overlay/50 px-4 py-3'>
                        <span className='text-sm text-surface-subtle'>{t('socket.socket_id')}</span>
                        <code className='text-xs font-mono text-surface-foreground bg-surface-elevated px-2 py-1 rounded-lg border border-border'>
                            {socket?.id || t('socket.no_id')}
                        </code>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
