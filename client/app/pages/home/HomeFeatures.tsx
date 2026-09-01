// -Path: 'Vite-React-Router-TypeScript/src/pages/home/HomeFeatures.tsx'
import { motion } from 'framer-motion';
import Card from '~/components/custom/Card';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { FaBolt, FaGlobe, FaRoute, FaPalette, FaCubesStacked, FaRocket } from 'react-icons/fa6';

const features = [
    { key: 'performance', Icon: FaRocket },
    { key: 'routing', Icon: FaRoute },
    { key: 'i18n', Icon: FaGlobe },
    { key: 'theme', Icon: FaPalette },
    { key: 'socket', Icon: FaBolt },
    { key: 'state', Icon: FaCubesStacked },
] as const;

export default function HomeFeatures() {
    const { t } = useTranslation();

    return (
        <motion.section
            transition={{ duration: 0.8 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            className='py-16 sm:py-24 bg-surface-overlay/30'
        >
            <div className='mx-auto max-w-6xl px-4 sm:px-6'>
                <div className='text-center mb-12'>
                    <Badge className='mb-4'>✨ {t('home.features')}</Badge>
                    <h2 className='text-3xl sm:text-4xl font-black tracking-tight text-surface-foreground'>
                        {t('home.features')}
                    </h2>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {features.map(({ key, Icon }) => (
                        <Card
                            key={key}
                            icon={<Icon className='w-5 h-5' />}
                            title={t(`features.${key}.title`)}
                            description={t(`features.${key}.description`)}
                        >
                            <span />
                        </Card>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
