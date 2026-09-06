// -Path: 'client/app/pages/japanese/kana/components/KanaHero.tsx'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Badge from '~/components/custom/Badge';

export default function KanaHero() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-8'
        >
            <Badge variant='info' className='mb-6'>
                {t('japanese.kana.badge')}
            </Badge>
            <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                {t('japanese.kana.title')}
            </h1>
            <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                {t('japanese.kana.description')}
            </p>
        </motion.div>
    );
}
