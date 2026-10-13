// -Path: 'client/app/pages/study/components/DeckLink.tsx'
import { Link } from '~/i18n/routing';

/**
 * One deck destination on the study hub: an icon block, the title and the
 * description. `dashed` marks the full-width Manage row, which is visually set
 * apart from the Learn/Practice columns.
 */
export default function DeckLink({
    to,
    icon,
    title,
    description,
    dashed = false,
}: {
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    /** Dashed border for the Manage row. */
    dashed?: boolean;
}) {
    return (
        <Link
            to={to}
            className={`group flex items-center gap-4 rounded-sm border bg-surface p-5 transition-colors hover:border-primary hover:bg-surface-overlay ${
                dashed ? 'border-dashed border-line-strong' : 'border-line'
            }`}
        >
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-primary-emphasis'>
                {icon}
            </span>
            <span className='min-w-0 flex-1'>
                <span className='block text-sm font-bold tracking-tight text-surface-foreground'>
                    {title}
                </span>
                <span className='mt-0.5 block text-sm text-surface-muted'>{description}</span>
            </span>
        </Link>
    );
}
