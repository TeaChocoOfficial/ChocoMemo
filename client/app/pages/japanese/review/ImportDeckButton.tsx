// -Path: 'client/app/pages/japanese/review/ImportDeckButton.tsx'
import { useRef, useState } from 'react';
import { FaDownload } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useDeckStore } from '~/stores/deck.store';

/** Reads a .json deck file from disk and hands it to the store for
 *  validation. Local-only for now, mirroring the exam import flow. */
export default function ImportDeckButton() {
    const inputRef = useRef<HTMLInputElement>(null);
    const importDeck = useDeckStore((s) => s.importDeck);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleFile = async (file: File) => {
        setError(null);
        try {
            const text = await file.text();
            const raw = JSON.parse(text) as unknown;
            const result = importDeck(raw);
            if (!result.success) setError(result.error);
        } catch {
            setError(t('japanese.decks.importErrorJson'));
        }
    };

    return (
        <div>
            <input
                ref={inputRef}
                type='file'
                accept='application/json'
                className='hidden'
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                    e.target.value = '';
                }}
            />
            <Button variant='outline' size='sm' onClick={() => inputRef.current?.click()}>
                <FaDownload className='h-3.5 w-3.5' />
                {t('japanese.decks.importDeck')}
            </Button>
            {error && <p className='mt-1 text-xs text-error'>{error}</p>}
        </div>
    );
}