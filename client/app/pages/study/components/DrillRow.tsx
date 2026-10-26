// -Path: 'client/app/pages/study/components/DrillRow.tsx'
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import type { StudyItem } from '../hooks/useStudyTargets';

/**
 * One drill row: a language badge, the drill name and description, and a
 * trailing "Start" action. Always a link; the active target's row is tinted.
 */
export default function DrillRow({ item }: { item: StudyItem }) {
    const { t } = useTranslation();

    const className = `flex items-center gap-4 px-4 py-4 transition-colors ${
        item.active ? 'bg-primary-subtle hover:bg-primary-muted' : 'hover:bg-surface-overlay'
    }`;

    return (
        <Link to={`/drill/${item.code}`} className={className}>
            <span
                aria-hidden='true'
                className='flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line bg-surface text-sm font-black text-surface-foreground'
            >
                {item.glyph}
            </span>
            <span className='min-w-0 flex-1'>
                <span className='block text-sm font-bold tracking-tight text-surface-foreground'>
                    {t(`study.drill.items.${item.code}.name`)}
                </span>
                <span className='mt-0.5 block text-sm text-surface-muted'>
                    {t(`study.drill.items.${item.code}.description`)}
                </span>
            </span>
            <span className='shrink-0 text-sm font-semibold text-primary'>
                {t('study.action.start')}
            </span>
        </Link>
    );
}
