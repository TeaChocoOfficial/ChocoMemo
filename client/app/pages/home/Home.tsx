// -Path: 'client/app/pages/home/Home.tsx'
import { motion } from 'framer-motion';
import Card from '~/components/custom/Card';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaArrowRight } from 'react-icons/fa6';
import HomeHero from './HomeHero';

export default function HomePage() {
    const { t } = useTranslation();

    const features: {
        to: string;
        icon: React.ReactNode;
        title: string;
        description: string;
        action: string;
    }[] = [
        {
            to: '/japanese/characters',
            icon: <span className='text-2xl font-black leading-none'>あ</span>,
            title: t('home.features.characters.title'),
            description: t('home.features.characters.description'),
            action: t('home.features.characters.action'),
        },
        {
            to: '/japanese/characters/quiz',
            icon: <span className='text-2xl font-black leading-none'>学</span>,
            title: t('home.features.characterQuiz.title'),
            description: t('home.features.characterQuiz.description'),
            action: t('home.features.characterQuiz.action'),
        },
        {
            to: '/japanese/vocabulary/quiz',
            icon: <span className='text-2xl font-black leading-none'>語</span>,
            title: t('home.features.vocabularyQuiz.title'),
            description: t('home.features.vocabularyQuiz.description'),
            action: t('home.features.vocabularyQuiz.action'),
        },
    ];

    return (
        <>
            <HomeHero />

            <section className='relative overflow-hidden pb-24'>
                <div className='mx-auto max-w-5xl px-4 sm:px-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.to}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={feature.to} className='block h-full'>
                                    <Card
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                        className='h-full'
                                    >
                                        <span className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent'>
                                            {feature.action}
                                            <FaArrowRight className='w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1' />
                                        </span>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}