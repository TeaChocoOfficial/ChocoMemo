// -Path: 'client/app/pages/language-select/LanguageSelectHero.tsx'
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { FaLanguage } from 'react-icons/fa6';

export default function LanguageSelectHero() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-12'
        >
            <Badge variant='info' className='mb-6'>
                <FaLanguage className='w-3 h-3' /> {t('languageSelect.badge')}
            </Badge>

            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-surface-foreground mb-4'>
                {t('languageSelect.title')}
            </h1>
            <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                {t('languageSelect.description')}
            </p>
        </motion.div>
    );
}
