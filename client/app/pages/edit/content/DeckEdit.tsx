// -Path: 'client/app/pages/edit/content/DeckEdit.tsx'
import { useState } from 'react';
import type { DeckType } from '~/types/deck';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import type { DeckFormValues } from '~/types/edit';
import { useEditor } from '~/hooks/editor/useEditor';
import DeckFormField from '../components/DeckFormField';
import { DECK_FORM_FIELDS } from '~/data/deckFormFields';
import { readDeckFormValues, toDeckMeta, toDeckPatch, isDeckEditable } from '~/utils/edit/deckForm';

/**
 * Right pane of the deck editor: the form for the selected deck, or an empty
 * form when the editor is creating one. The layout is driven by
 * `DECK_FORM_FIELDS`, so the form follows the registry instead of the registry
 * following the form — adding a property is a config entry, not a JSX edit.
 *
 * @returns The rendered form, or a prompt when nothing is selected or drafted.
 */
export default function DeckEdit() {
    const { t, i18n } = useTranslation();
    const { data, decks, creating, create, selected, remove, update } = useEditor();
    /** Type a draft deck starts as, mirroring the explorer's active filter. */
    const draftType: DeckType = data.filter === 'all' ? 'vocab' : data.filter;
    const [values, setValues] = useState<DeckFormValues>(() =>
        readDeckFormValues(selected, i18n.language, { index: decks.length, type: draftType }),
    );

    /** Official and community decks belong to someone else, so the form only
     *  reads them: no submit, no delete, every control disabled. */
    const readOnly = !isDeckEditable(selected);
    const canSave = !readOnly && values.name.trim().length > 0;
    const cover = values.image.trim();

    /** The registry pairs each key with a kind whose control produces exactly
     *  that value, which a flat record cannot express; the cast states the
     *  contract instead of spawning one `useState` per property. */
    const setValue = (key: keyof DeckFormValues, value: string | boolean) =>
        setValues((prev) => ({ ...prev, [key]: value }) as DeckFormValues);

    /** Creates the drafted deck, or persists every edited field onto the
     *  selected one. */
    const handleSubmit = (event: React.SubmitEvent) => {
        event.preventDefault();
        if (!canSave || readOnly) return;
        const patch = toDeckPatch(values, selected, i18n.language);
        if (creating) {
            create({ ...patch, meta: toDeckMeta(values) });
            return;
        }
        if (!selected) return;
        update({ ...patch, meta: { ...selected.meta, ...toDeckMeta(values, selected.meta) } });
    };

    if (!selected && !creating)
        return (
            <div className='flex h-full items-center justify-center p-8 text-center text-sm text-surface-muted'>
                {t('deck.edit.selectPrompt')}
            </div>
        );

    return (
        <form onSubmit={handleSubmit} className='flex h-full flex-col gap-5 overflow-y-auto p-5'>
            {readOnly && (
                <p className='rounded-sm border border-line-strong bg-surface-overlay px-3 py-2 text-xs text-surface-muted'>
                    {t('deck.edit.readOnly')}
                </p>
            )}

            {cover && (
                <img
                    src={cover}
                    alt=''
                    className='h-20 w-full rounded-sm border border-line object-cover'
                />
            )}

            {DECK_FORM_FIELDS.map((def) => (
                <DeckFormField
                    key={def.key}
                    def={def}
                    disabled={readOnly}
                    value={values[def.key]}
                    onChange={(value) => setValue(def.key, value)}
                />
            ))}

            {!readOnly && (
                <div className='mt-auto flex flex-wrap justify-end gap-3'>
                    {!creating && (
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => remove()}
                            brandColor='var(--color-error)'
                        >
                            {t('deck.edit.delete')}
                        </Button>
                    )}
                    <Button type='submit' variant='primary' disabled={!canSave}>
                        {creating ? t('deck.edit.create') : t('deck.edit.save')}
                    </Button>
                </div>
            )}
        </form>
    );
}
