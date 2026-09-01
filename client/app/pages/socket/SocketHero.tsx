// -Path: 'Vite-React-TypeScript/src/pages/socket/SocketHero.tsx'
import { motion } from 'framer-motion';
import { FaBolt } from 'react-icons/fa6';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';

interface SocketHeroProps {
    isConnected: boolean;
}

export default function SocketHero({ isConnected }: SocketHeroProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
        >
            <Badge variant={isConnected ? 'success' : 'error'} className='mb-6'>
                <FaBolt className={`w-3 h-3 ${isConnected ? 'animate-pulse' : ''}`} />
                {isConnected ? t('socket.connected') : t('socket.disconnected')}
            </Badge>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-surface-foreground mb-4'>
                {t('socket.title')}
            </h1>
            <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                {t('socket.description')}
            </p>
        </motion.div>
    );
}
