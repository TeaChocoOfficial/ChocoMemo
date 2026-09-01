// -Path: 'Vite-React-TypeScript/src/pages/socket/PlayerCount.tsx'
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa6';
import Card from '~/components/custom/Card';
import { useTranslation } from 'react-i18next';

interface PlayerCountProps {
    count: number;
}

export default function PlayerCount({ count }: PlayerCountProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className='h-full' title={t('socket.players')} icon={<FaUsers className='w-5 h-5' />}>
                <div className='mt-4'>
                    <div className='flex items-center justify-center rounded-xl bg-surface-elevated/50 px-4 py-8'>
                        <div className='text-center'>
                            <p className='text-5xl font-black text-primary mb-2'>{count}</p>
                            <p className='text-sm text-surface-subtle'>
                                {t('socket.players')}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
