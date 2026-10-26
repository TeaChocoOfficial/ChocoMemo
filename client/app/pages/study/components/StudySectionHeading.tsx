// -Path: 'client/app/pages/study/components/StudySectionHeading.tsx'
import type { IconType } from 'react-icons';

/**
 * A study-hub section header: a plain title and a one-line description. Kept
 * separate from `components/custom/SectionHeading`, which renders a numbered
 * step counter this page does not use.
 */
export default function StudySectionHeading({
    Icon,
    title,
    description,
}: {
    title: string;
    Icon: IconType;
    description: string;
}) {
    return (
        <div className='mb-4'>
            <h2 className='flex items-center gap-2 text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                <Icon className='shrink-0 ' />
                {title}
            </h2>
            <p className='mt-1 text-sm leading-relaxed text-surface-muted'>{description}</p>
        </div>
    );
}
