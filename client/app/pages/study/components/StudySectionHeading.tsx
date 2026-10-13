// -Path: 'client/app/pages/study/components/StudySectionHeading.tsx'

/**
 * A study-hub section header: a plain title and a one-line description. Kept
 * separate from `components/custom/SectionHeading`, which renders a numbered
 * step counter this page does not use.
 */
export default function StudySectionHeading({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className='mb-4'>
            <h2 className='text-xl font-bold tracking-tight text-surface-foreground sm:text-2xl'>
                {title}
            </h2>
            <p className='mt-1 text-sm leading-relaxed text-surface-muted'>{description}</p>
        </div>
    );
}
