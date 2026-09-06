// -Path: 'client/app/pages/japanese/exams/ExamSetList.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import Section from '~/components/custom/Section';
import CollectionListPage from '~/components/container/CollectionListPage';
import { defaultExamSets } from '~/data/japanese/defaultExamSets';
import { useAllExamSets, useExamSetsStore } from '~/stores/examSets.store';
import ExamSetCard from './components/ExamSetCard';
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

                <CollectionListPage
                    eyebrow='Exam desk'
                    title='Vocabulary Exams'
                    description='Test yourself with multiple-choice exams built from your vocabulary. Pick a set to begin, or import your own.'
                    searchPlaceholder='Search exam sets...'
                    localItems={allSets}
                    cloudItems={null}
                    communityItems={null}
                    getSearchText={(set) => set.title + ' ' + (set.description ?? '')}
                    emptyStateLabel='No exam sets yet — import one to get started.'
                    headerAction={<ImportExamButton />}
                    renderItem={(set) => (
                        <ExamSetCard
                            examSet={set}
                            onDelete={
                                set.source === 'custom'
                                    ? () => removeCustomSet(set.id)
                                    : set.source === 'imported'
                                      ? () => removeImportedSet(set.id)
                                      : undefined
                            }
                        />
                    )}
                />
            </div>
        </Section>
    );
}