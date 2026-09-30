// -Path: 'client/app/pages/japanese/vocabulary/VocabularyDeck.tsx'
import { useState } from 'react';
import { Link } from '~/i18n/routing';
import { useParams } from 'react-router';
import { useSpeak } from '~/hooks/useSpeak';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import Section from '~/components/custom/Section';
import { useLangText } from '~/hooks/useLangText';
import WordEditor, { type WordDraft } from './components/WordEditor';
import { useVocabularyStore } from '~/stores/japanese/vocabulary.store';
import { FaArrowLeft, FaPen, FaTrash, FaVolumeHigh } from 'react-icons/fa6';
import { deckWords, findDeck, useDeckStore } from '~/stores/japanese/deck.store';

/** Browses one deck's words: surface form, reading, meaning and example, with
 *  tap-to-speak. Custom words can be added, edited, and deleted; the built-in
 *  defaults ship with the app and are shown read-only. */
export default function VocabDeck() {
    const { t } = useTranslation();
    const locale = useLangText();
    const speak = useSpeak();
    const { deckId = '' } = useParams();

    const { custom, addCustom, updateCustom, removeCustom } = useVocabularyStore();
    const updateDeck = useDeckStore((s) => s.updateDeck);
    const [editing, setEditing] = useState<{ id: string | null } | null>(null);

    const deck = findDeck(deckId);
    const words = deck ? deckWords(deck) : [];
    const customIds = new Set(custom.map((w) => w.id));

    if (!deck) {
        return (
            <Section className='items-start justify-center'>
                <div className='mx-auto max-w-5xl px-4 py-16 text-center sm:px-6'>
                    <p className='text-sm text-surface-muted'>{t('japanese.vocab.empty')}</p>
                </div>
            </Section>
        );
    }

    const save = (draft: WordDraft) => {
        if (editing?.id) {
            updateCustom(editing.id, draft);
        } else {
            const id = addCustom(draft);
            // A deck resolves words by id, so a brand-new word has to be linked
            // to the deck being read. Built-in decks are static data, so the
            // word only lands in "My Words" there.
            if (deck.source === 'local' && !deck.contentIds.includes(id)) {
                updateDeck(deck.id, { contentIds: [...deck.contentIds, id] });
            }
        }
        setEditing(null);
    };

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese/vocab'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocab.back_hub')}
                </Link>

                <div className='mb-8 flex flex-wrap items-center justify-between gap-3'>
                    <h1 className='text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
                        {locale(deck.name)}
                    </h1>
                    <Button size='sm' variant='outline' onClick={() => setEditing({ id: null })}>
                        {t('japanese.vocab.addWord')}
                    </Button>
                </div>

                <ul className='space-y-3'>
                    {words.map((word) => {
                        const isCustom = customIds.has(word.id);
                        return (
                            <li
                                key={word.id}
                                className='rounded-sm border border-line bg-surface p-4 sm:p-5'
                            >
                                <div className='flex items-start gap-3'>
                                    <div className='min-w-0 flex-1'>
                                        <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                                            <span className='text-xl font-black text-surface-foreground'>
                                                {word.word}
                                            </span>
                                            {word.reading && (
                                                <span className='text-sm text-surface-muted'>
                                                    {word.reading}
                                                </span>
                                            )}
                                        </div>
                                        <p className='mt-1 text-sm text-surface-foreground/90'>
                                            {locale(word.meaning)}
                                        </p>
                                        {word.example.segments.length > 0 && (
                                            <p className='mt-2 text-sm text-surface-muted'>
                                                {locale(word.example.meaning)}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => speak(word.word)}
                                        aria-label={t('japanese.vocab.read')}
                                        title={t('japanese.vocab.read')}
                                        className='inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                                    >
                                        <FaVolumeHigh className='h-4 w-4' />
                                    </button>

                                    {isCustom && (
                                        <>
                                            <button
                                                type='button'
                                                onClick={() => setEditing({ id: word.id })}
                                                aria-label={t('japanese.vocab.edit')}
                                                title={t('japanese.vocab.edit')}
                                                className='inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                                            >
                                                <FaPen className='h-3.5 w-3.5' />
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => removeCustom(word.id)}
                                                aria-label={t('japanese.vocab.delete')}
                                                title={t('japanese.vocab.delete')}
                                                className='inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-error'
                                            >
                                                <FaTrash className='h-3.5 w-3.5' />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {!isCustomEditable(words, customIds) && (
                    <p className='mt-6 text-xs text-surface-muted'>{t('japanese.vocab.builtIn')}</p>
                )}
            </div>

            <WordEditor
                isOpen={editing !== null}
                word={editing?.id ? (custom.find((w) => w.id === editing.id) ?? null) : null}
                onClose={() => setEditing(null)}
                onSave={save}
            />
        </Section>
    );
}

/** True when the deck contains at least one user word, i.e. the "built-in
 *  words can't be edited" note would be misleading. */
function isCustomEditable(words: { id: string }[], customIds: Set<string>): boolean {
    return words.some((w) => customIds.has(w.id));
}
