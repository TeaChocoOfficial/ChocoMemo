// -Path: 'client/app/pages/japanese/review/AddCustomDeckButton.tsx'
// "Add custom new deck" — composes a custom VocabDeck from the words the
// user picks (default + custom vocabulary), then hands it to the store.
import { FaPlus } from 'react-icons/fa6';
import { useMemo, useState } from 'react';
import type { DeckData } from '~/types/deck';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useDeckStore } from '~/stores/japanese/deck.store';
import WordPicker from '~/components/custom/WordPicker';
import { useVocabularyStore } from '~/stores/japanese/vocabulary.store';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '~/components/custom/Modal';

export default function AddCustomDeckButton() {
    const { t } = useTranslation();
    const { addDeck } = useDeckStore();
    const [name, setName] = useState('');
    const { custom } = useVocabularyStore();
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const allWords = useMemo(() => [...DEFAULT_VOCABULARY, ...custom], [custom]);

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
        const deck: DeckData = {
            id: `deck-custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            name: name.trim(),
            description: description.trim() || undefined,
            source: 'local',
            type: 'vocab',
            contentIds: selected,
            tags: [],
            nsfw: false,
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
                <ModalHeader
                    title={t('japanese.decks.form.title')}
                    onClose={() => setOpen(false)}
                />
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
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
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
                                className='w-full border-b border-line-strong bg-transparent py-2 font-sans text-sm text-surface-foreground placeholder:text-surface-muted outline-none transition-colors focus:border-primary'
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
