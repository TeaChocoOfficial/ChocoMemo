// -Path: 'client/app/pages/characters/en/components/SectionHeading.tsx'

/**
 * The step heading above the grid: a mono step marker, a hairline, the group
 * label, and the hint under it.
 *
 * @param step - Step marker, e.g. `01 · Uppercase`.
 * @param label - The active group's display name.
 * @param hint - One-line instruction under the heading.
 * @returns The rendered section heading.
 */
export function SectionHeading({ step, label, hint }: { step: string; label: string; hint: string }) {
    return (
        <div className='mb-6'>
            <div className='flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                    {step}
                </span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-surface-foreground'>
                    {label}
                </h2>
            </div>
            <p className='mt-2 text-sm leading-relaxed text-surface-muted'>{hint}</p>
        </div>
    );
}
