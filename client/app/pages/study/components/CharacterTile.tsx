// -Path: 'client/app/pages/study/components/CharacterTile.tsx'
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import type { StudyItem } from '../hooks/useStudyTargets';

/**
 * A character-set tile, dominated by the script glyph. Always a link to the
 * chart route; the active target is tinted with an accent border, while the
 * others are dashed and dimmed.
 */
export default function CharacterTile({ item }: { item: StudyItem }) {
    const { t } = useTranslation();

    const className = `flex min-h-37.5 flex-col rounded-sm border p-5 transition-[transform,border-color,background-color] duration-200 ${
        item.active
            ? 'border-primary bg-primary-subtle hover:bg-primary-muted'
            : 'border-dashed border-line-strong bg-surface opacity-60 hover:bg-surface-overlay'
    }`;

    return (
        <Link to={`/characters/${item.code}`} className={className}>
            <span
                aria-hidden='true'
                className='block text-5xl font-black leading-none text-surface-foreground'
            >
                {item.glyph}
            </span>
            <span className='mt-4 block text-base font-bold tracking-tight text-surface-foreground'>
                {t(`study.characters.items.${item.code}.name`)}
            </span>
            <span className='mt-0.5 block text-xs text-surface-muted'>{item.subtitle}</span>
        </Link>
    );
}
