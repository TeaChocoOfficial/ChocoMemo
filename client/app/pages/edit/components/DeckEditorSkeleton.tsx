// -Path: 'client/app/components/edit/DeckEditorSkeleton.tsx'
import { useTranslation } from 'react-i18next';

/** Placeholder squares for the activity rail icons. */
const RAIL_ITEM = 'h-10 w-10 rounded-sm bg-surface-overlay';
/** Placeholder rows for the explorer / list. */
const ROW = 'h-9 w-full rounded-sm bg-surface-overlay';
/** Short placeholder for a heading. */
const HEADING = 'h-3 w-24 rounded-sm bg-surface-overlay';
/** Placeholder for a text field. */
const FIELD = 'w-full rounded-sm bg-surface-overlay';

/**
 * Full-screen loading skeleton for the deck editor. Both layouts are rendered
 * and toggled with `md:` utilities, so the skeleton matches the viewport even
 * during SSR and the first paint — before a media query could be read — without
 * a hydration mismatch. The desktop side mirrors the docked rail, explorer,
 * editor and status bar; the mobile side mirrors the horizontal rail with a
 * stacked list and form.
 *
 * @returns The rendered skeleton.
 */
export default function DeckEditorSkeleton() {
    const { t } = useTranslation();

    return (
        <div role='status' aria-busy='true' className='h-full w-full'>
            <span className='sr-only'>{t('deck.edit.loading')}</span>

            <div className='hidden h-full w-full animate-pulse flex-col overflow-hidden md:flex'>
                <div className='flex min-h-0 flex-1'>
                    <div className='flex shrink-0 flex-col items-center gap-1.5 border-r border-line bg-surface-sunken p-1.5'>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className={RAIL_ITEM} />
                        ))}
                    </div>

                    <div className='flex min-w-0 flex-1'>
                        <div className='w-64 shrink-0 space-y-3 border-r border-line p-4 sm:w-72'>
                            <div className={HEADING} />
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div key={index} className={ROW} />
                            ))}
                        </div>

                        <div className='min-w-0 flex-1 space-y-5 p-6'>
                            <div className={HEADING} />
                            <div className={`${FIELD} h-10`} />
                            <div className={`${FIELD} h-24`} />
                            <div className='h-10 w-2/3 rounded-sm bg-surface-overlay' />
                        </div>
                    </div>
                </div>

                <div className='h-7 shrink-0 bg-primary-subtle' />
            </div>

            <div className='flex h-full animate-pulse flex-col gap-3 overflow-hidden p-3 md:hidden'>
                <div className='flex gap-1'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={RAIL_ITEM} />
                    ))}
                </div>

                <div className='h-10 w-full rounded-sm border border-dashed border-line-strong' />

                <div className='space-y-3 rounded-sm border border-line p-4'>
                    <div className={HEADING} />
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={ROW} />
                    ))}
                </div>

                <div className='space-y-4 rounded-sm border border-line p-4'>
                    <div className={HEADING} />
                    <div className={`${FIELD} h-10`} />
                    <div className={`${FIELD} h-20`} />
                    <div className='h-10 w-2/3 rounded-sm bg-surface-overlay' />
                </div>
            </div>
        </div>
    );
}
