// -Path: 'client/app/pages/guide/components/GuideSectionHeading.tsx'
import type { IconType } from 'react-icons';

/**
 * A guide section header: the icon beside the title and the one-line hint
 * under it. It mirrors the study hub's section heading so the guide reads as
 * part of the same app, with the icon doing the work the numbered counter does
 * on the other feature pages.
 */
export default function GuideSectionHeading({
    Icon,
    title,
    hint,
}: {
    /** The section's icon. */
    Icon: IconType;
    title: string;
    hint: string;
}) {
    return (
        <div className='mb-6'>
            <h2 className='flex items-center gap-2 text-xl font-bold tracking-tight text-surface-foreground sm:text-2xl'>
                <Icon className='h-3.5 w-3.5 shrink-0 opacity-70' />
                {title}
            </h2>
            <p className='mt-1.5 max-w-2xl text-sm leading-relaxed text-surface-muted'>{hint}</p>
        </div>
    );
}
