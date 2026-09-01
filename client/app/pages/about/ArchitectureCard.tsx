// -Path: 'Vite-React-Router-TypeScript/app/pages/about/ArchitectureCard.tsx'
import Card from '~/components/custom/Card';
import { useTranslation } from 'react-i18next';

export default function ArchitectureCard() {
    const { t } = useTranslation();

    return (
        <Card className='p-8!'>
            <h2 className='text-2xl font-bold text-surface-foreground mb-4'>
                {t('about.architecture')}
            </h2>
            <p className='text-surface-subtle leading-relaxed'>{t('about.architecture_desc')}</p>
            <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='rounded-xl border border-border bg-surface-overlay/50 p-4 text-center'>
                    <p className='text-xs font-medium text-surface-subtle mb-1'>Build</p>
                    <p className='text-sm font-bold text-surface-foreground'>Vite + ESBuild</p>
                </div>
                <div className='rounded-xl border border-border bg-surface-overlay/50 p-4 text-center'>
                    <p className='text-xs font-medium text-surface-subtle mb-1'>Render</p>
                    <p className='text-sm font-bold text-surface-foreground'>React Router SSR</p>
                </div>
                <div className='rounded-xl border border-border bg-surface-overlay/50 p-4 text-center'>
                    <p className='text-xs font-medium text-surface-subtle mb-1'>State</p>
                    <p className='text-sm font-bold text-surface-foreground'>Zustand Store</p>
                </div>
            </div>
        </Card>
    );
}
