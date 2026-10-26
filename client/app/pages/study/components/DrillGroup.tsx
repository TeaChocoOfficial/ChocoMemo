// -Path: 'client/app/pages/study/components/DrillGroup.tsx'
import { FaBolt } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import DrillRow from './DrillRow';
import StudySectionHeading from './StudySectionHeading';
import type { StudyItem } from '../hooks/useStudyTargets';

/**
 * The Drill group: one row per drill, inside a single bordered container with
 * dividers — deliberately a list, not a card grid.
 */
export default function DrillGroup({ items }: { items: StudyItem[] }) {
    const { t } = useTranslation();

    return (
        <section>
            <StudySectionHeading
                Icon={FaBolt}
                title={t('study.drill.title')}
                description={t('study.drill.description')}
            />
            <div className='divide-y divide-line overflow-hidden rounded-sm border border-line'>
                {items.map((item) => (
                    <DrillRow key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
