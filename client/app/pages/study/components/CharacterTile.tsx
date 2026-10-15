// -Path: 'client/app/pages/study/components/CharacterTile.tsx'
import { Link } from '~/i18n/routing';
import StatusPill from './StatusPill';
import { useTranslation } from 'react-i18next';
import type { CharacterSetConfig, TargetStatus } from '~/data/language';

/**
 * A character-set tile, dominated by the script glyph. A ready chart is a link
 * to its route and lifts on hover; a coming-soon one is inert — no `href`, not
 * focusable, dashed and dimmed. The active target's ready tile gets an accent
 * border and tint instead of the hover lift.
 */
export default function CharacterTile({
    code,
    active,
    status,
    feature,
}: {
    code: string;
    active: boolean;
    status: TargetStatus;
    feature: CharacterSetConfig;
}) {
    const { t } = useTranslation();
    const ready = status === 'ready';
    const current = ready && active;

    const body = (
        <>
            <span
                aria-hidden='true'
                className='block text-5xl font-black leading-none text-surface-foreground'
            >
                {feature.glyph}
            </span>
            <span className='mt-4 block text-base font-bold tracking-tight text-surface-foreground'>
                {t(feature.name)}
            </span>
            <span className='mt-0.5 block text-xs text-surface-muted'>{feature.subtitle}</span>
            <span className='mt-3 block'>
                <StatusPill status={status} active={active} />
            </span>
        </>
    );

    const className = `flex min-h-37.5 flex-col rounded-sm border p-5 transition-[transform,border-color,background-color] duration-200 ${
        current
            ? 'border-primary bg-primary-subtle'
            : ready
              ? 'border-line bg-surface motion-safe:hover:-translate-y-0.5 hover:border-primary'
              : 'border-dashed border-line-strong bg-surface opacity-60'
    }`;

    if (!ready) {
        return (
            <div aria-disabled='true' className={className}>
                {body}
            </div>
        );
    }

    return (
        <Link to={`/characters/${code}`} className={className}>
            {body}
        </Link>
    );
}
