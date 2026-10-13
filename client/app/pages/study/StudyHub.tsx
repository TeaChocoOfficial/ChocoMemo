// -Path: 'client/app/pages/study/StudyHub.tsx'
import { useTranslation } from 'react-i18next';
import PageShell from '~/components/custom/PageShell';
import DeckGroup from './components/DeckGroup';
import DrillGroup from './components/DrillGroup';
import { useTargetLang } from '~/hooks/useTargetLang';
import CharacterGroup from './components/CharacterGroup';
import { useStudyTargets } from './hooks/useStudyTargets';
import TargetLangSelect from '~/components/container/TargetLangSelect';

/**
 * The study hub: the overview a visitor lands on after picking a language. It
 * has three deliberately different groups — character tiles, a drill list, and
 * the deck destinations for the active target — all driven by the capabilities
 * config, so adding a language only needs a config entry.
 */
export default function StudyHub() {
    const { t } = useTranslation();
    const targetLang = useTargetLang();
    const { characters, drills } = useStudyTargets();
    const languageName = t(`languageSelect.languages.${targetLang}.name`);

    return (
        <PageShell>
            <header className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                    <h1 className='text-3xl font-black tracking-tighter text-surface-foreground sm:text-4xl'>
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

            <div className='space-y-12'>
                <CharacterGroup items={characters} />
                <DrillGroup items={drills} />
                <DeckGroup targetLang={targetLang} languageName={languageName} />
            </div>
        </PageShell>
    );
}
