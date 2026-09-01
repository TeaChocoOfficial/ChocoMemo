// -Path: 'Vite-React-Router-TypeScript/app/pages/about/HeroSection.tsx'
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <div className='text-center mb-16'>
            <Badge className='mb-4'>📖 {t('nav.about')}</Badge>
            <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-6'>
                {t('about.title')}
            </h1>
            <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                {t('about.description')}
            </p>
        </div>
    );
}
