// -Path: 'client/app/pages/japanese/exams/ExamSetList.tsx'
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import Section from '~/components/custom/Section';
import DecksList from '~/components/container/DecksList';
import { defaultExamSets } from '~/data/japanese/defaultExamSets';
import { useAllExamSets, useExamSetsStore } from '~/stores/examSets.store';
import ExamSetCard from './components/ExamSetCard';
import ImportExamButton from './ImportExamButton';
import AddCustomExamButton from './AddCustomExamButton';

export default function DeckListPage() {
    const { t } = useTranslation();
    const decks = useAllExamSets(defaultExamSets);
    const removeCustomSet = useExamSetsStore((s) => s.removeCustomSet);
    const removeImportedSet = useExamSetsStore((s) => s.removeImportedSet);

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.exams.back_hub')}
                </Link>

                <DecksList
                    localItems={decks}
                    eyebrow='Exam desk'
                    title={t('japanese.exams.title')}
                    description={t('japanese.exams.description')}
                    searchPlaceholder={t('japanese.exams.search')}
                    cloudItems={null}
                    communityItems={null}
                    getSearchText={(set) => set.title + ' ' + (set.description ?? '')}
                    emptyStateLabel={t('japanese.exams.empty')}
                    headerAction={
                        <div className='flex flex-wrap items-center gap-2'>
                            <ImportExamButton />
                            <AddCustomExamButton />
                        </div>
                    }
                    renderItem={(set, index) => (
                        <ExamSetCard
                            examSet={set}
                            index={index}
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