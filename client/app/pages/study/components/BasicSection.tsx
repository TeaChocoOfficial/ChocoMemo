// -Path: 'client/app/pages/study/components/BasicSection.tsx'
import DrillGroup from './DrillGroup';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import CharacterGroup from './CharacterGroup';
import { FaBookOpen, FaChevronDown } from 'react-icons/fa6';
import type { StudyItem } from '../hooks/useStudyTargets';
import { useStudyBasics } from '~/hooks/config/useStudyBasics';

/**
 * The hub's basics block — the character tiles and the drill list — behind a
 * dropdown title. Pressing the title expands or collapses the group; only the
 * content moves, so the title and its chevron stay anchored and the block can
 * always be brought back.
 */
export default function BasicSection({
    items,
}: {
    /** The study items shared by the character and drill groups. */
    items: StudyItem[];
}) {
    const { t } = useTranslation();
    const { basicHidden, toggleBasicHidden } = useStudyBasics();

    return (
        <section>
            <button
                type='button'
                aria-expanded={!basicHidden}
                onClick={() => toggleBasicHidden()}
                className='group mb-4 flex w-full cursor-pointer items-center justify-between gap-2 border-b border-line p-2 px-3 text-left hover:bg-surface-overlay'
            >
                <span className='flex items-center gap-2 text-xl font-bold tracking-tight text-surface-foreground transition-colors group-hover:text-primary sm:text-2xl'>
                    <FaBookOpen className='shrink-0' />
                    {t('study.basic.title')}
                </span>
                <motion.span
                    transition={{ duration: 0.2 }}
                    animate={{ rotate: basicHidden ? 0 : 180 }}
                    className='flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-surface-muted transition-colors group-hover:text-primary'
                >
                    <FaChevronDown className='h-3.5 w-3.5' />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {!basicHidden && (
                    <motion.div
                        key='study-basics'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className='overflow-hidden'
                    >
                        <div className='flex flex-col gap-8'>
                            <CharacterGroup items={items} />
                            <DrillGroup items={items} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
