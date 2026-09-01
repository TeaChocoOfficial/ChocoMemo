// -Path: 'Vite-React-TypeScript/src/pages/threejs/ThreejsInfo.tsx'
import { motion } from 'framer-motion';
import Card from '~/components/custom/Card';
import { useTranslation } from 'react-i18next';
import { SiWebgl, SiReact, SiThreedotjs } from 'react-icons/si';

const items = [
    { key: 'renderer', icon: <SiWebgl className='w-5 h-5' /> },
    { key: 'interaction', icon: <SiReact className='w-5 h-5' /> },
    { key: 'shapes', icon: <SiThreedotjs className='w-5 h-5' /> },
] as const;

export default function ThreejsInfo() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <h2 className='text-2xl font-bold text-surface-foreground mb-6 text-center'>
                {t('threejs.features_title')}
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
                            {t(`threejs.feature_${key}_title`)}
                        </h3>
                        <p className='text-sm text-surface-subtle leading-relaxed'>
                            {t(`threejs.feature_${key}_desc`)}
                        </p>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
