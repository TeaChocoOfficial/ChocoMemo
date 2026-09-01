// -Path: 'Vite-React-TypeScript/src/pages/socket/SocketInfo.tsx'
import { motion } from 'framer-motion';
import Card from '~/components/custom/Card';
import { useTranslation } from 'react-i18next';
import { FaBolt, FaPlug, FaLayerGroup } from 'react-icons/fa6';

const items = [
    { key: 'realtime', icon: <FaBolt className='w-5 h-5' /> },
    { key: 'websocket', icon: <FaPlug className='w-5 h-5' /> },
    { key: 'scalable', icon: <FaLayerGroup className='w-5 h-5' /> },
] as const;

export default function SocketInfo() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <h2 className='text-2xl font-bold text-surface-foreground mb-6 text-center'>
                {t('socket.features_title')}
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                {items.map(({ key, icon }) => (
                    <Card key={key} className='p-6 text-center'>
                        <div className='flex justify-center mb-4'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                                {icon}
                            </div>
                        </div>
                        <h3 className='text-lg font-bold text-surface-foreground mb-2'>
                            {t(`socket.feature_${key}_title`)}
                        </h3>
                        <p className='text-sm text-surface-subtle leading-relaxed'>
                            {t(`socket.feature_${key}_desc`)}
                        </p>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
