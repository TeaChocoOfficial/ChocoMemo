// -Path: 'client/app/components/edit/DeckEditPanel.tsx'
import { useId, useState } from 'react';
import type { DeckData } from '~/types/deck';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import Switch from '~/components/custom/Switch';
import { readLangText, writeLangText, parseTags } from '~/utils/edit/edit';

/** Props for {@link DeckEditPanel}. */
interface DeckEditPanelProps {
    deck: DeckData | null;
    onSave: (patch: Partial<DeckData>) => void;
    onDelete: () => void;
}

const LABEL = 'text-xs font-semibold uppercase tracking-wider text-surface-subtle';
const FIELD =
    'w-full rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';
const AREA = `${FIELD} resize-none`;

/**
 * Right pane of the deck editor: the form for the selected deck. Mount it with
 * a `key` of the deck id so picking a different deck resets the drafts without
 * a sync effect. Language-agnostic — it edits text, tags and the NSFW flag.
 *
 * @param props - The selected deck and the save/delete sinks.
 * @returns The rendered form, or a prompt when nothing is selected.
 */
export default function DeckEditPanel({ deck, onSave, onDelete }: DeckEditPanelProps) {
    const nameId = useId();
    const descId = useId();
    const tagsId = useId();
    const { t, i18n } = useTranslation();
    const [nsfw, setNsfw] = useState(() => deck?.nsfw ?? false);
    const [tags, setTags] = useState(() => (deck?.tags ?? []).join(', '));
    const [name, setName] = useState(() => readLangText(deck?.name, i18n.language));
    const [description, setDescription] = useState(() =>
        readLangText(deck?.description, i18n.language),
    );

    const trimmedName = name.trim();
    const canSave = trimmedName.length > 0;

    /** Persists every edited field back onto the selected deck. */
    const handleSubmit = (event: React.SubmitEvent) => {
        event.preventDefault();
        if (!deck || !canSave) return;
        const descriptionText = description.trim();
        onSave({
            name: writeLangText(deck.name, i18n.language, trimmedName),
            tags: parseTags(tags),
            nsfw,
            description: descriptionText
                ? writeLangText(deck.description, i18n.language, descriptionText)
                : undefined,
        });
    };

    if (!deck)
        return (
            <div className='flex h-full items-center justify-center p-8 text-center text-sm text-surface-muted'>
                {t('deck.edit.selectPrompt')}
            </div>
        );

    return (
        <form onSubmit={handleSubmit} className='flex h-full flex-col gap-5 p-5'>
            <div className='flex items-center justify-end'>
                <Badge>{t(`deck.type.${deck.type}`)}</Badge>
            </div>

            <div className='flex flex-col gap-1.5'>
                <label htmlFor={nameId} className={LABEL}>
                    {t('deck.edit.nameLabel')}
                </label>
                <input
                    id={nameId}
                    value={name}
                    className={FIELD}
                    placeholder={t('deck.edit.namePlaceholder')}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label htmlFor={descId} className={LABEL}>
                    {t('deck.edit.descriptionLabel')}
                </label>
                <textarea
                    rows={4}
                    id={descId}
                    value={description}
                    className={AREA}
                    placeholder={t('deck.edit.descriptionPlaceholder')}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label htmlFor={tagsId} className={LABEL}>
                    {t('deck.edit.tagsLabel')}
                </label>
                <input
                    id={tagsId}
                    value={tags}
                    className={FIELD}
                    placeholder={t('deck.edit.tagsPlaceholder')}
                    onChange={(event) => setTags(event.target.value)}
                />
            </div>

            <Switch checked={nsfw} onCheckedChange={setNsfw} label={t('deck.edit.nsfwLabel')} />

            <div className='mt-auto flex flex-wrap justify-end gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onDelete}
                    brandColor='var(--color-error)'
                >
                    {t('deck.edit.delete')}
                </Button>
                <Button type='submit' variant='primary' disabled={!canSave}>
                    {t('deck.edit.save')}
                </Button>
            </div>
        </form>
    );
}
