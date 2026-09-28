// -Path: 'client/app/pages/japanese/vocabulary/ImportExamButton.tsx'
import { useRef, useState } from 'react';
import { Languages } from '~/data/language';
import { FaArrowRightToBracket } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';

/** Reads a .json exam file from disk and hands it to the store for
 *  validation. No cloud/server support yet — this is the "local import"
 *  half only, matching what's needed right now. */
export default function ImportExamButton() {
    const inputRef = useRef<HTMLInputElement>(null);
    const importExamSet = useDeckListLocalStore((s) => s.importExamSet);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleFile = async (file: File) => {
        setError(null);
        try {
            const text = await file.text();
            const raw = JSON.parse(text) as unknown;
            const result = importExamSet(Languages.ja, raw);
            if (!result.success) setError(result.error);
        } catch {
            setError(t('japanese.exam.importErrorJson'));
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
                <FaArrowRightToBracket className='h-3.5 w-3.5' />
                {t('japanese.exam.import')}
            </Button>
            {error && <p className='mt-1 text-xs text-error'>{error}</p>}
        </div>
    );
}
