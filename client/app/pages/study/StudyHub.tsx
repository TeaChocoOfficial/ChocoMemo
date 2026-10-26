// -Path: 'client/app/pages/study/StudyHub.tsx'
import { useTranslation } from 'react-i18next';
import DeckGroup from './components/DeckGroup';
import { FaGraduationCap } from 'react-icons/fa6';
import BasicSection from './components/BasicSection';
import PageShell from '~/components/custom/PageShell';
import { useStudyTargets } from './hooks/useStudyTargets';
import TargetLangSelect from '~/components/container/TargetLangSelect';

/**
 * The study hub: the overview a visitor lands on after picking a language. It
 * has three deliberately different groups — character tiles, a drill list, and
 * the deck destinations for the active target — all driven by the capabilities
 * config, so adding a language only needs a config entry. The basics block can
 * be collapsed, and that choice is remembered on the device.
 */
export default function StudyHub() {
    const { t } = useTranslation();
    const { characters } = useStudyTargets();

    return (
        <PageShell>
            <header className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                    <h1 className='flex text-3xl font-black gap-2 tracking-tighter text-surface-foreground sm:text-4xl'>
                        <FaGraduationCap />
                        {t('study.title')}
                    </h1>
                    <p className='mt-2 text-sm leading-relaxed text-surface-muted'>
                        {t('study.subtitle')}
                    </p>
                </div>
                <div className='w-full sm:w-52'>
                    <TargetLangSelect />
                </div>
            </header>

            <div className='space-y-6'>
                <BasicSection items={characters} />
                <DeckGroup />
            </div>
        </PageShell>
    );
}
