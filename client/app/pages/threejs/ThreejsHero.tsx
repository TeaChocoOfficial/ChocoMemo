// -Path: 'Vite-React-TypeScript/src/pages/threejs/ThreejsHero.tsx'
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { SiThreedotjs } from 'react-icons/si';
import { useTranslation } from 'react-i18next';

export default function ThreejsHero() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
        >
            <Badge variant='info' className='mb-6'>
                <SiThreedotjs className='w-3 h-3' /> {t('threejs.badge')}
            </Badge>

            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-surface-foreground mb-4'>
                {t('threejs.title')}
            </h1>
            <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                {t('threejs.description')}
            </p>
        </motion.div>
    );
}
