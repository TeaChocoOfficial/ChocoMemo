// -Path: 'client/app/components/custom/SectionHeading.tsx'

/** Numbered section header used across the feature pages: a mono step
 *  counter, a hairline rule, then the title. `hint` adds a line of context
 *  underneath. */
export default function SectionHeading({
    step,
    label,
    hint,
    className = '',
}: {
    step: string;
    label: string;
    hint?: string;
    className?: string;
}) {
    return (
        <div className={`mb-6 ${className}`}>
            <div className='flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                    {step}
                </span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-surface-foreground'>
                    {label}
                </h2>
            </div>
            {hint && <p className='mt-2 text-sm leading-relaxed text-surface-muted'>{hint}</p>}
        </div>
    );
}
