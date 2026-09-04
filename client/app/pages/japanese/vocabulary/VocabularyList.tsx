// -Path: 'client/app/pages/japanese/vocabulary/VocabularyList.tsx'
import { useState } from 'react';
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import Badge from '~/components/custom/Badge';
import Button from '~/components/custom/Button';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaCircleRight, FaPlus, FaTrash } from 'react-icons/fa6';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';

export default function VocabularyListPage() {
    const { t } = useTranslation();
    const { custom, addCustom, removeCustom } = useVocabularyStore();

    const [jpValue, setJpValue] = useState('');
    const [readingValue, setReadingValue] = useState('');
    const [meaningValue, setMeaningValue] = useState('');
    const [showAdd, setShowAdd] = useState(false);

    const handleSubmitWord = () => {
        if (!jpValue.trim() || !meaningValue.trim()) return;
        addCustom({
            word: jpValue.trim(),
            reading: readingValue.trim(),
            meaning: meaningValue.trim(),
            example: { before: '', after: '', targetReading: '', english: '' },
        });
        setJpValue('');
        setReadingValue('');
        setMeaningValue('');
    };

    return (
        <section className='relative min-h-screen overflow-hidden py-16 sm:py-20'>
            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabularyList.back_hub')}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-center mb-10'
                >
                    <Badge variant='info' className='mb-6'>
                        {t('japanese.vocabularyList.badge')}
                    </Badge>
                    <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                        {t('japanese.vocabularyList.title')}
                    </h1>
                    <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                        {t('japanese.vocabularyList.description')}
                    </p>
                </motion.div>

                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8'>
                    <p className='text-sm text-surface-muted'>
                        {DEFAULT_VOCABULARY.length + custom.length}{' '}
                        {t('japanese.vocabularyList.available', {
                            count: DEFAULT_VOCABULARY.length + custom.length,
                        })}
                    </p>
                    <div className='flex items-center gap-3'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setShowAdd((v) => !v)}
                        >
                            <FaPlus className='w-3.5 h-3.5' />
                            {t('japanese.vocabularyList.addWord')}
                        </Button>
                        <Link
                            to='/japanese/vocabulary/practice'
                            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-accent-foreground text-sm font-semibold transition-colors duration-200 hover:bg-accent-emphasis'
                        >
                            {t('japanese.nav.practice.action')}
                            <FaCircleRight className='w-4 h-4' />
                        </Link>
                    </div>
                </div>

                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className='overflow-hidden mb-8'
                    >
                        <div className='rounded-sm border border-line bg-surface p-6'>
                            <h3 className='text-lg font-bold tracking-tight text-surface-foreground mb-4'>
                                {t('japanese.vocabularyList.manageTitle')}
                            </h3>
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4'>
                                <input
                                    value={jpValue}
                                    onChange={(e) => setJpValue(e.target.value)}
                                    placeholder={t('japanese.vocabularyList.jpPlaceholder')}
                                    className='px-4 py-2.5 rounded-sm border border-line bg-surface-overlay text-surface-foreground focus:outline-accent transition-colors'
                                />
                                <input
                                    value={readingValue}
                                    onChange={(e) => setReadingValue(e.target.value)}
                                    placeholder={t('japanese.vocabularyList.readingPlaceholder')}
                                    className='px-4 py-2.5 rounded-sm border border-line bg-surface-overlay text-surface-foreground focus:outline-accent transition-colors'
                                />
                                <input
                                    value={meaningValue}
                                    onChange={(e) => setMeaningValue(e.target.value)}
                                    placeholder={t('japanese.vocabularyList.meaningPlaceholder')}
                                    className='px-4 py-2.5 rounded-sm border border-line bg-surface-overlay text-surface-foreground focus:outline-accent transition-colors'
                                />
                            </div>
                            <Button variant='primary' size='sm' onClick={handleSubmitWord}>
                                <FaPlus className='w-3.5 h-3.5' />
                                {t('japanese.vocabularyList.add')}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {custom.length > 0 && (
                    <div className='mb-10'>
                        <h2 className='mb-4 text-lg font-bold text-surface-foreground'>
                            {t('japanese.vocabularyList.customSection')}
                        </h2>
                        <ul className='space-y-2'>
                            {custom.map((word) => (
                                <li
                                    key={word.id}
                                    className='flex items-center justify-between gap-3 rounded-sm border border-line bg-surface-overlay px-4 py-2.5'
                                >
                                    <div>
                                        <span className='font-bold text-surface-foreground'>
                                            {word.word}
                                        </span>
                                        <span className='text-sm text-surface-muted ml-2'>
                                            {word.reading && `${word.reading} · `}
                                            {word.meaning}
                                        </span>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => removeCustom(word.id)}
                                        className='text-surface-muted hover:text-error transition-colors cursor-pointer'
                                        aria-label={t('japanese.vocabularyList.remove')}
                                    >
                                        <FaTrash className='w-4 h-4' />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <h2 className='mb-4 text-lg font-bold text-surface-foreground'>
                        {t('japanese.vocabularyList.defaultSection')}
                    </h2>
                    <ul className='space-y-2'>
                        {DEFAULT_VOCABULARY.map((word) => (
                            <li
                                key={word.id}
                                className='rounded-sm border border-line bg-surface-overlay px-4 py-2.5'
                            >
                                <span className='font-bold text-surface-foreground'>
                                    {word.word}
                                </span>
                                <span className='text-sm text-surface-muted ml-2'>
                                    {word.reading} · {word.meaning}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
