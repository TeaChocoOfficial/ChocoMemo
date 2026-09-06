// -Path: 'client/app/pages/japanese/exams/AddCustomExamButton.tsx'
// "Add custom new" for the exams list — composes a custom ExamSet from
// the words the user picks (same engine default sets are built with),
// then hands it to the store under source 'custom'.
import { useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '~/components/custom/Modal';
import WordPicker from '~/components/custom/WordPicker';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useExamSetsStore } from '~/stores/examSets.store';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import { buildExamSetFromVocabulary } from '~/utils/exam';
import type { ExamSet } from '~/types/exam';

export default function AddCustomExamButton() {
    const { t } = useTranslation();
    const customWords = useVocabularyStore((s) => s.custom);
    const addCustomSet = useExamSetsStore((s) => s.addCustomSet);

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const allWords = useMemo(() => [...DEFAULT_VOCABULARY, ...customWords], [customWords]);

    const toggle = (id: string) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const reset = () => {
        setTitle('');
        setDescription('');
        setSelected([]);
        setError(null);
    };

    const handleCreate = () => {
        if (!title.trim()) {
            setError(t('japanese.exams.form.titleError'));
            return;
        }
        if (selected.length < 2) {
            setError(t('japanese.exams.form.minWordsError'));
            return;
        }
        const words = allWords.filter((w) => selected.includes(w.id));
        const set: ExamSet = buildExamSetFromVocabulary(words, {
            id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            title: title.trim(),
            description: description.trim() || undefined,
            source: 'custom',
        });
        addCustomSet(set);
        reset();
        setOpen(false);
    };

    return (
        <>
            <Button size='sm' onClick={() => setOpen(true)}>
                <FaPlus className='h-3.5 w-3.5' />
                {t('japanese.exams.addCustom')}
            </Button>

            <Modal isOpen={open} onClose={() => setOpen(false)} size='lg'>
                <ModalHeader
                    title={t('japanese.exams.form.title')}
                    onClose={() => setOpen(false)}
                />
                <ModalBody>
                    <p className='mb-5 text-sm text-surface-subtle'>
                        {t('japanese.exams.form.subtitle')}
                    </p>

                    <div className='space-y-5'>
                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.exams.form.titleLabel')}
                            </label>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('japanese.exams.form.titlePlaceholder')}
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-accent'
                            />
                        </div>

                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.exams.form.descriptionLabel')}
                            </label>
                            <input
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('japanese.exams.form.descriptionPlaceholder')}
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-accent'
                            />
                        </div>

                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.exams.form.wordsLabel')}
                            </label>
                            <WordPicker
                                words={allWords}
                                selected={selected}
                                onToggle={toggle}
                                placeholder={t('japanese.exams.form.wordsPlaceholder')}
                            />
                            <p className='mt-1.5 text-xs text-surface-muted'>
                                {t('japanese.exams.form.selectedCount', { count: selected.length })}
                            </p>
                        </div>
                    </div>

                    {error && <p className='mt-4 text-sm text-error'>{error}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button variant='outline' size='md' onClick={() => setOpen(false)}>
                        {t('japanese.exams.form.cancel')}
                    </Button>
                    <Button size='md' onClick={handleCreate}>
                        {t('japanese.exams.form.submit')}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}