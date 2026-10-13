// -Path: 'client/app/pages/study/components/CharacterGroup.tsx'
import { useTranslation } from 'react-i18next';
import CharacterTile from './CharacterTile';
import StudySectionHeading from './StudySectionHeading';
import type { StudyItem } from '../hooks/useStudyTargets';
import type { CharacterSetConfig } from '~/data/language';

/** Responsive auto-fit grid, about 150px per tile. */
const GRID = 'grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3';

/**
 * The Characters group: one tile per character set, ready ones first (ordered
 * by `useStudyTargets`). Languages without a chart are absent entirely.
 */
export default function CharacterGroup({ items }: { items: StudyItem<CharacterSetConfig>[] }) {
    const { t } = useTranslation();

    return (
        <section>
            <StudySectionHeading
                title={t('study.characters.title')}
                description={t('study.characters.description')}
            />
            <div className={GRID}>
                {items.map((item) => (
                    <CharacterTile
                        key={item.language.id}
                        code={item.language.code}
                        feature={item.feature}
                        active={item.active}
                        status={item.status}
                    />
                ))}
            </div>
        </section>
    );
}
