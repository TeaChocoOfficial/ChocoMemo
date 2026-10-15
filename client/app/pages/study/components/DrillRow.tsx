// -Path: 'client/app/pages/study/components/DrillRow.tsx'
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import StatusPill from './StatusPill';
import type { DrillConfig, TargetStatus } from '~/data/language';

/**
 * One drill row: a language badge, the drill name and description, and a
 * trailing action. A ready drill is a link and is tinted when it is the active
 * target; a coming-soon one is inert (no `href`, not focusable, dimmed).
 */
export default function DrillRow({
    code,
    feature,
    active,
    status,
}: {
    code: string;
    feature: DrillConfig;
    active: boolean;
    status: TargetStatus;
}) {
    const { t } = useTranslation();
    const ready = status === 'ready';
    const current = ready && active;

    const body = (
        <>
            <span
                aria-hidden='true'
                className='flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line bg-surface text-sm font-black text-surface-foreground'
            >
                {feature.badge}
            </span>
            <span className='min-w-0 flex-1'>
                <span className='block text-sm font-bold tracking-tight text-surface-foreground'>
                    {t(feature.name)}
                </span>
                <span className='mt-0.5 block text-sm text-surface-muted'>
                    {t(feature.description)}
                </span>
            </span>
            <span className='shrink-0'>
                {ready ? (
                    <span className='text-sm font-semibold text-primary'>
                        {t('study.action.start')}
                    </span>
                ) : (
                    <StatusPill status={status} active={active} />
                )}
            </span>
        </>
    );

    const className = `flex items-center gap-4 px-4 py-4 transition-colors ${
        current ? 'bg-primary-subtle' : ready ? 'hover:bg-surface-overlay' : 'opacity-60'
    }`;

    if (!ready) {
        return (
            <div aria-disabled='true' className={className}>
                {body}
            </div>
        );
    }

    return (
        <Link to={`/drill/${code}`} className={className}>
            {body}
        </Link>
    );
}
