// -Path: 'client/app/pages/study/components/DrillGroup.tsx'
import { useTranslation } from 'react-i18next';
import DrillRow from './DrillRow';
import StudySectionHeading from './StudySectionHeading';
import type { StudyItem } from '../hooks/useStudyTargets';
import type { DrillConfig } from '~/data/language';

/**
 * The Drill group: one row per drill, inside a single bordered container with
 * dividers — deliberately a list, not a card grid.
 */
export default function DrillGroup({ items }: { items: StudyItem<DrillConfig>[] }) {
    const { t } = useTranslation();

    return (
        <section>
            <StudySectionHeading
                title={t('study.drill.title')}
                description={t('study.drill.description')}
            />
            <div className='divide-y divide-line overflow-hidden rounded-sm border border-line'>
                {items.map((item) => (
                    <DrillRow
                        key={item.language.id}
                        code={item.language.code}
                        feature={item.feature}
                        active={item.active}
                    />
                ))}
            </div>
        </section>
    );
}
