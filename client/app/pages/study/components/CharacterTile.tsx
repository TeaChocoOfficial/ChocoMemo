// -Path: 'client/app/pages/study/components/CharacterTile.tsx'
import { Link } from '~/i18n/routing';
import StatusPill from './StatusPill';
import { useTranslation } from 'react-i18next';
import type { CharacterSetConfig } from '~/data/language';

/**
 * A character-set tile, dominated by the script glyph. Always a link to the
 * chart route; the active target is tinted with an accent border, while the
 * others are dashed and dimmed.
 */
export default function CharacterTile({
    code,
    active,
    feature,
}: {
    code: string;
    active: boolean;
    feature: CharacterSetConfig;
}) {
    const { t } = useTranslation();

    const body = (
        <>
            <span
                aria-hidden='true'
                className='block text-5xl font-black leading-none text-surface-foreground'
            >
                {feature.glyph}
            </span>
            <span className='mt-4 block text-base font-bold tracking-tight text-surface-foreground'>
                {t(`study.characters.items.${code}.name`)}
            </span>
            <span className='mt-0.5 block text-xs text-surface-muted'>{feature.subtitle}</span>
            <span className='mt-3 block'>
                <StatusPill active={active} />
            </span>
        </>
    );

    const className = `flex min-h-37.5 flex-col rounded-sm border p-5 transition-[transform,border-color,background-color] duration-200 ${
        active
            ? 'border-primary bg-primary-subtle'
            : 'border-dashed border-line-strong bg-surface opacity-60'
    }`;

    return (
        <Link to={`/characters/${code}`} className={className}>
            {body}
        </Link>
    );
}
