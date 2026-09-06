// -Path: 'client/app/pages/japanese/vocabulary/ImportExamButton.tsx'
import { useRef, useState } from 'react';
import Button from '~/components/custom/Button';
import { useExamSetsStore } from '~/stores/examSets.store';

/** Reads a .json exam file from disk and hands it to the store for
 *  validation. No cloud/server support yet — this is the "local import"
 *  half only, matching what's needed right now. */
export default function ImportExamButton() {
    const inputRef = useRef<HTMLInputElement>(null);
    const importSet = useExamSetsStore((s) => s.importSet);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        setError(null);
        try {
            const text = await file.text();
            const raw = JSON.parse(text) as unknown;
            const result = importSet(raw);
            if (!result.success) setError(result.error);
        } catch {
            setError('Could not read this file as JSON.');
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
                Import exam set
            </Button>
            {error && <p className='mt-1 text-xs text-error'>{error}</p>}
        </div>
    );
}