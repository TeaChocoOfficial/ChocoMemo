// -Path: 'client/app/pages/japanese/exam/AddCustomExamButton.tsx'
// "Add custom new" for the exam list — composes a custom ExamSet from
// the words the user picks (same engine default sets are built with),
// then hands it to the store under source 'custom'.
import { useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '~/components/custom/Modal';
import WordPicker from '~/components/custom/WordPicker';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import { useVocabularyStore } from '~/stores/japanese/vocabulary.store';
import { buildExamSetFromVocabulary } from '~/utils/exam';
import type { ExamSet } from '~/types/deck/exam';

export default function AddCustomExamButton() {
    const { t } = useTranslation();
    const customWords = useVocabularyStore((s) => s.custom);
    const addExamSet = useDeckListLocalStore((s) => s.addExamSet);

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
            setError(t('japanese.exam.form.titleError'));
            return;
        }
        if (selected.length < 2) {
            setError(t('japanese.exam.form.minWordsError'));
            return;
        }
        const words = allWords.filter((w) => selected.includes(w.id));
        const set: ExamSet = buildExamSetFromVocabulary(words, {
            id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            title: title.trim(),
            description: description.trim() || undefined,
            source: 'local',
        });
        addExamSet(set);
        reset();
        setOpen(false);
    };

    return (
        <>
            <Button size='sm' onClick={() => setOpen(true)}>
                <FaPlus className='h-3.5 w-3.5' />
                {t('japanese.exam.addCustom')}
            </Button>

            <Modal isOpen={open} onClose={() => setOpen(false)} size='lg'>
                <ModalHeader
                    title={t('japanese.exam.form.title')}
                    onClose={() => setOpen(false)}
                />
                <ModalBody>
                    <p className='mb-5 text-sm text-surface-subtle'>
                        {t('japanese.exam.form.subtitle')}
                    </p>

                    <div className='space-y-5'>
                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.exam.form.titleLabel')}
                            </label>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('japanese.exam.form.titlePlaceholder')}
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
                            />
                        </div>

                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.exam.form.descriptionLabel')}
                            </label>
                            <input
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('japanese.exam.form.descriptionPlaceholder')}
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
                            />
                        </div>

                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.exam.form.wordsLabel')}
                            </label>
                            <WordPicker
                                words={allWords}
                                selected={selected}
                                onToggle={toggle}
                                placeholder={t('japanese.exam.form.wordsPlaceholder')}
                            />
                            <p className='mt-1.5 text-xs text-surface-muted'>
                                {t('japanese.exam.form.selectedCount', { count: selected.length })}
                            </p>
                        </div>
                    </div>

                    {error && <p className='mt-4 text-sm text-error'>{error}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button variant='outline' size='md' onClick={() => setOpen(false)}>
                        {t('japanese.exam.form.cancel')}
                    </Button>
                    <Button size='md' onClick={handleCreate}>
                        {t('japanese.exam.form.submit')}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
