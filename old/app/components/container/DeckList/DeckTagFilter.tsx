// -Path: 'client/app/components/container/DeckList/DeckTagFilter.tsx'
// Tag chips: narrow the list to decks that carry every selected tag.
//
// The chip set is drawn from `availableTags` passed in rather than
// recomputed from the filtered list, so a tag that would filter everything
// down to zero still remains present and tappable. That way a viewer who
// clicked the wrong tag can unselect it in one tap instead of being trapped
// in an empty list with no visible way to back out.
import { useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';
import Button from '~/components/custom/Button';

export default function DeckTagFilter({
    tags,
    selected,
    onToggle,
    onClear,
}: {
    /** All tags present in the current tab. */
    tags: string[];
    /** The tags the viewer has already picked. */
    selected: string[];
    onToggle: (tag: string) => void;
    onClear: () => void;
}) {
    const { t } = useTranslation();

    if (tags.length === 0 && selected.length === 0) return null;

    return (
        <div className='flex flex-wrap items-center gap-2'>
            {tags.map((tag) => {
                const isSelected = selected.includes(tag);
                return (
                    <button
                        key={tag}
                        type='button'
                        onClick={() => onToggle(tag)}
                        aria-pressed={isSelected}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ${
                            isSelected
                                ? 'border-primary bg-primary/12 text-primary'
                                : 'border-line bg-surface hover:bg-surface-overlay'
                        }`}
                    >
                        {tag}
                        {isSelected && (
                            <FaXmark
                                className='h-3 w-3'
                                aria-label={t('deck.tags.remove', { tag })}
                            />
                        )}
                    </button>
                );
            })}

            {selected.length > 0 && (
                <Button variant='ghost' size='sm' onClick={onClear}>
                    {t('deck.tags.clear')}
                </Button>
            )}
        </div>
    );
}