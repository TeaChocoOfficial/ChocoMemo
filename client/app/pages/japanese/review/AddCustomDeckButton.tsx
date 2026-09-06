// -Path: 'client/app/pages/japanese/review/AddCustomDeckButton.tsx'
// "Add custom new deck" — composes a custom VocabDeck from the words the
// user picks (default + custom vocabulary), then hands it to the store.
import { useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '~/components/custom/Modal';
import WordPicker from '~/components/custom/WordPicker';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useDeckStore } from '~/stores/deck.store';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import type { VocabDeck } from '~/types/vocabulary';

export default function AddCustomDeckButton() {
    const { t } = useTranslation();
    const customWords = useVocabularyStore((s) => s.custom);
    const addDeck = useDeckStore((s) => s.addDeck);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const allWords = useMemo(() => [...DEFAULT_VOCABULARY, ...customWords], [customWords]);

    const toggle = (id: string) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const reset = () => {
        setName('');
        setDescription('');
        setSelected([]);
        setError(null);
    };

    const handleCreate = () => {
        if (!name.trim()) {
            setError(t('japanese.decks.form.nameError'));
            return;
        }
        if (selected.length < 1) {
            setError(t('japanese.decks.form.minWordsError'));
            return;
        }
        const deck: VocabDeck = {
            id: `deck-custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            name: name.trim(),
            description: description.trim() || undefined,
            source: 'custom',
            wordIds: selected,
        };
        addDeck(deck);
        reset();
        setOpen(false);
    };

    return (
        <>
            <Button size='sm' onClick={() => setOpen(true)}>
                <FaPlus className='h-3.5 w-3.5' />
                {t('japanese.decks.addCustom')}
            </Button>

            <Modal isOpen={open} onClose={() => setOpen(false)} size='lg'>
                <ModalHeader title={t('japanese.decks.form.title')} onClose={() => setOpen(false)} />
                <ModalBody>
                    <p className='mb-5 text-sm text-surface-subtle'>
                        {t('japanese.decks.form.subtitle')}
                    </p>

                    <div className='space-y-5'>
                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.decks.form.nameLabel')}
                            </label>
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('japanese.decks.form.namePlaceholder')}
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-accent'
                            />
                        </div>

                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.decks.form.descriptionLabel')}
                            </label>
                            <input
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('japanese.decks.form.descriptionPlaceholder')}
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-accent'
                            />
                        </div>

                        <div>
                            <label className='mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-surface-muted'>
                                {t('japanese.decks.form.wordsLabel')}
                            </label>
                            <WordPicker
                                words={allWords}
                                selected={selected}
                                onToggle={toggle}
                                placeholder={t('japanese.decks.form.wordsPlaceholder')}
                            />
                            <p className='mt-1.5 text-xs text-surface-muted'>
                                {t('japanese.decks.form.selectedCount', { count: selected.length })}
                            </p>
                        </div>
                    </div>

                    {error && <p className='mt-4 text-sm text-error'>{error}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button variant='outline' size='md' onClick={() => setOpen(false)}>
                        {t('japanese.decks.form.cancel')}
                    </Button>
                    <Button size='md' onClick={handleCreate}>
                        {t('japanese.decks.form.submit')}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}