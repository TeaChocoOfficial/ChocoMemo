// -Path: 'client/app/components/container/DeckList/DeckImportButton.tsx'
// Brings a deck in from a `.json` file the viewer already has.
//
// Written for the shared list rather than reusing `ImportDeckButton`: that one
// writes to `japanese/deck.store`, which is a different store from the one the
// deck-list pages read, so a deck imported through it would never appear in the
// list it was imported from. This writes through `deckListLocal.store`, the
// single store the list, the counts and the tally all agree on.
//
// The store validates the payload and reports why it refused, but its reasons
// are developer-facing English; the copy shown here comes from i18n so the
// message matches the rest of the page.
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFileImport } from 'react-icons/fa6';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import type { DeckType } from '~/types/deck';
import type { Languages } from '~/data/language';

export default function DeckImportButton({
    language,
    type,
    onImported,
}: {
    /** Which language's list the deck lands in. */
    language: Languages;
    /** Pick the schema: vocabulary files and exam-set files are different. */
    type: DeckType;
    /** Called after a successful import so the caller can surface a result. */
    onImported?: () => void;
}) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const importDeck = useDeckListLocalStore((state) => state.importDeck);
    const importExamSet = useDeckListLocalStore((state) => state.importExamSet);

    const handleFile = async (file: File) => {
        setError(null);
        let raw: unknown;
        try {
            raw = JSON.parse(await file.text());
        } catch {
            // Malformed JSON is the viewer's file being wrong, not the app's,
            // so it gets its own message rather than sharing the schema one.
            setError(t('deck.import.invalidJson'));
            return;
        }

        const result =
            type === 'exam' ? importExamSet(language, raw) : importDeck(language, raw);
        if (!result.success) {
            setError(t(`deck.import.${type === 'exam' ? 'invalidExam' : 'invalidDeck'}`));
            return;
        }
        onImported?.();
    };

    return (
        <div className='px-1'>
            <input
                ref={inputRef}
                type='file'
                accept='application/json,.json'
                className='hidden'
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleFile(file);
                    // Reset so choosing the same file twice fires again —
                    // picking the file you just imported is the obvious retry.
                    event.target.value = '';
                }}
            />
            <button
                type='button'
                onClick={() => inputRef.current?.click()}
                className='flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-medium text-surface-foreground transition-colors hover:bg-surface-overlay'
            >
                <FaFileImport className='h-3.5 w-3.5 text-surface-muted' />
                {t('deck.import.action')}
            </button>
            {error && <p className='px-3 pb-1 text-xs text-error'>{error}</p>}
        </div>
    );
}