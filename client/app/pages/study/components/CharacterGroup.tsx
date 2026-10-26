// -Path: 'client/app/pages/study/components/CharacterGroup.tsx'
import { FaLanguage } from 'react-icons/fa6';
import CharacterTile from './CharacterTile';
import { useTranslation } from 'react-i18next';
import StudySectionHeading from './StudySectionHeading';
import type { StudyItem } from '../hooks/useStudyTargets';

/** Responsive auto-fit grid, about 150px per tile. */
const GRID = 'grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3';

/**
 * The Characters group: one tile per character set, ready ones first (ordered
 * by `useStudyTargets`). Languages without a chart are absent entirely.
 */
export default function CharacterGroup({ items }: { items: StudyItem[] }) {
    const { t } = useTranslation();

    return (
        <section>
            <StudySectionHeading
                Icon={FaLanguage}
                title={t('study.characters.title')}
                description={t('study.characters.description')}
            />
            <div className={GRID}>
                {items.map((item) => (
                    <CharacterTile key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
