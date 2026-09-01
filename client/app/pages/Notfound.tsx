// -Path: 'Vite-React-TypeScript/Vite-React-TypeScript/app/pages/Notfound.tsx'
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';

export default function Notfound() {
    const { t } = useTranslation();

    return (
        <section className='relative overflow-hidden py-20 sm:py-28'>
            <div className='absolute inset-0 -z-10'>
                <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-error/10 rounded-full blur-3xl' />
                <div className='absolute bottom-0 right-0 w-100 h-100 bg-warning/5 rounded-full blur-3xl' />
            </div>

            <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
                className='mx-auto max-w-6xl px-4 sm:px-6 text-center'
            >
                <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className='text-[10rem] sm:text-[14rem] font-black tracking-tighter leading-none text-surface-foreground/10 select-none'
                >
                    {t('notfound.error_code')}
                </motion.span>

                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='-mt-12 sm:-mt-16 mb-8'
                >
                    <Badge variant='error' className='mb-4'>
                        {t('notfound.title')}
                    </Badge>

                    <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                        {t('notfound.title')}
                    </h1>

                    <p className='max-w-md mx-auto text-lg text-surface-subtle leading-relaxed mb-10'>
                        {t('notfound.description')}
                    </p>

                    <Link to='/'>
                        <Button size='lg' variant='primary'>
                            {t('notfound.back_home')}
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
