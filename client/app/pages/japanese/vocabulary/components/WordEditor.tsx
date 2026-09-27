// -Path: 'client/app/pages/japanese/vocabulary/components/WordEditor.tsx'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~/components/custom/Modal';
import Button from '~/components/custom/Button';
import type { VocabWord } from '~/types/vocabulary';

export type WordDraft = Omit<VocabWord, 'id'>;

interface WordEditorProps {
    isOpen: boolean;
    /** The word being edited, or null when adding a new one. */
    word: VocabWord | null;
    onClose: () => void;
    onSave: (draft: WordDraft) => void;
}

/** Add / edit form for a custom word.
 *
 * Only the surface form, reading, and a single-language meaning are editable.
 * Example sentences carry per-kanji furigana and per-locale glosses, which a
 * flat form can't express, so a new word is created with an empty example. */
export default function WordEditor({ isOpen, word, onClose, onSave }: WordEditorProps) {
    const { t } = useTranslation();
    const [surface, setSurface] = useState(word?.word ?? '');
    const [reading, setReading] = useState(word?.reading ?? '');
    const [meaning, setMeaning] = useState(
        typeof word?.meaning === 'string' ? word.meaning : '',
    );
    const [error, setError] = useState<string | null>(null);

    const submit = () => {
        if (!surface.trim() || !meaning.trim()) {
            setError(t('japanese.vocabulary.required'));
            return;
        }
        setError(null);
        onSave({
            word: surface.trim(),
            reading: reading.trim(),
            // Stored as a plain string rather than a per-locale record: the form
            // captures one language, and `useLangText` reads a bare string fine.
            meaning: meaning.trim(),
            example: { before: [], segments: [], after: [], meaning: meaning.trim() },
        });
    };

    const field =
        'w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='sm'>
            <ModalHeader
                title={word ? t('japanese.vocabulary.edit') : t('japanese.vocabulary.addWord')}
                onClose={onClose}
            />
            <ModalBody>
                <div className='space-y-4'>
                    <div>
                        <label className='mb-1 block text-xs font-medium text-surface-muted'>
                            {t('japanese.vocabulary.word')}
                        </label>
                        <input
                            className={field}
                            value={surface}
                            onChange={(e) => setSurface(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className='mb-1 block text-xs font-medium text-surface-muted'>
                            {t('japanese.vocabulary.reading')}
                        </label>
                        <input
                            className={field}
                            value={reading}
                            onChange={(e) => setReading(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className='mb-1 block text-xs font-medium text-surface-muted'>
                            {t('japanese.vocabulary.meaning')}
                        </label>
                        <input
                            className={field}
                            value={meaning}
                            onChange={(e) => setMeaning(e.target.value)}
                        />
                    </div>
                    {error && <p className='text-xs text-error'>{error}</p>}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant='ghost' onClick={onClose}>
                    {t('japanese.vocabulary.cancel')}
                </Button>
                <Button variant='primary' onClick={submit}>
                    {t('japanese.vocabulary.save')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
