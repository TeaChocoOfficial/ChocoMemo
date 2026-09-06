// -Path: 'client/app/pages/japanese/vocabulary/ExamSetList.tsx'
import { motion } from 'framer-motion';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import Badge from '~/components/custom/Badge';
import Section from '~/components/custom/Section';
import { defaultExamSets } from '~/data/japanese/defaultExamSets';
import { useAllExamSets, useExamSetsStore } from '~/stores/examSets.store';
import ExamSetCard from './ExamSetCard';
import ImportExamButton from './ImportExamButton';

export default function ExamSetList() {
    const allSets = useAllExamSets(defaultExamSets);
    const removeCustomSet = useExamSetsStore((s) => s.removeCustomSet);
    const removeImportedSet = useExamSetsStore((s) => s.removeImportedSet);

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    Back to hub
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-center mb-10'
                >
                    <Badge variant='info' className='mb-6'>
                        Vocabulary Exams
                    </Badge>
                    <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                        Vocabulary Exams
                    </h1>
                    <p className='mx-auto max-w-2xl text-lg text-surface-subtle leading-relaxed'>
                        Test yourself with multiple-choice exams built from your vocabulary.
                    </p>
                </motion.div>

                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8'>
                    <p className='text-sm text-surface-muted'>
                        {allSets.length} {allSets.length === 1 ? 'exam set' : 'exam sets'}
                    </p>
                    <ImportExamButton />
                </div>

                {allSets.length === 0 ? (
                    <p className='py-16 text-center text-sm text-surface-muted'>
                        No exam sets yet — import one to get started.
                    </p>
                ) : (
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {allSets.map((examSet) => (
                            <ExamSetCard
                                key={examSet.id}
                                examSet={examSet}
                                onDelete={
                                    examSet.source === 'custom'
                                        ? () => removeCustomSet(examSet.id)
                                        : examSet.source === 'imported'
                                          ? () => removeImportedSet(examSet.id)
                                          : undefined
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}