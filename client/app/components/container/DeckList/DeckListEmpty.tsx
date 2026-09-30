// What a deck tab shows when it has nothing in it: a reason, and — when there
// is somewhere real to go — one action. Separate from `DeckList` so the empty
// state can say why a tab is empty without the list knowing anything about
// cloud sync or community publishing.
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa6';

export default function DeckListEmpty({
    copy,
    action,
}: {
    /** i18n prefix holding `title` and `body`, e.g. `deck.empty.official`.
     *  Passed in rather than derived so a caller can pick a different reason
     *  for the same tab — an empty cloud tab reads differently signed in. */
    copy: string;
    /** The one action worth offering. Both exits a deck list has are in-page —
     *  switching tab, or opening the sign-in modal — so this is a button, and
     *  a tab with nowhere to send the viewer simply goes without one. */
    action?: { label: string; onClick: () => void };
}) {
    const { t } = useTranslation();

    return (
        <div className='flex flex-col items-center border border-dashed border-line-strong px-6 py-16 text-center'>
            <p className='font-sans text-lg font-bold tracking-tight text-surface-foreground'>
                {t(`${copy}.title`)}
            </p>
            <p className='mt-2 max-w-md text-sm leading-relaxed text-surface-subtle'>
                {t(`${copy}.body`)}
            </p>
            {action && (
                <button
                    type='button'
                    onClick={action.onClick}
                    className='mt-6 inline-flex cursor-pointer items-center gap-2 border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground'
                >
                    {action.label}
                    <FaArrowRight className='h-3.5 w-3.5' />
                </button>
            )}
        </div>
    );
}
