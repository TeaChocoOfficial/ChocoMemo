// -Path: 'client/app/pages/guide/Guide.tsx'
import { useTranslation } from 'react-i18next';
import { FaBookOpen, FaCompass, FaLayerGroup } from 'react-icons/fa6';
import PageShell from '~/components/custom/PageShell';
import Badge from '~/components/custom/Badge';
import GuideSteps from './components/GuideSteps';
import GuideSectionCard from './components/GuideSectionCard';
import GuideSectionHeading from './components/GuideSectionHeading';
import { guideSections } from '~/data/guide';

/**
 * The guide: a short, honest tour of the app. It opens with the four steps of
 * a first session, then walks through every area of the app in the order a
 * learner meets it — one card per area, each linking to the page it describes.
 */
export default function Guide() {
    const { t } = useTranslation();

    return (
        <PageShell>
            <header className='border-b border-line pb-8'>
                <div className='flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary'>
                    <FaBookOpen className='h-4 w-4' />
                    <span>{t('guide.badge')}</span>
                </div>
                <h1 className='mt-3 text-3xl font-black tracking-tighter text-surface-foreground sm:text-4xl'>
                    {t('guide.title')}
                </h1>
                <p className='mt-3 max-w-2xl text-base leading-relaxed text-surface-muted'>
                    {t('guide.subtitle')}
                </p>
                <div className='mt-5 flex flex-wrap gap-2'>
                    <Badge variant='info'>{t('guide.badge')}</Badge>
                    <Badge>{t('guide.tag')}</Badge>
                </div>
            </header>

            {/* Quick start */}
            <section className='mt-10'>
                <GuideSectionHeading
                    Icon={FaCompass}
                    title={t('guide.quickStart.title')}
                    hint={t('guide.quickStart.hint')}
                />
                <GuideSteps />
            </section>

            {/* Every area of the app */}
            <section className='mt-14'>
                <GuideSectionHeading
                    Icon={FaLayerGroup}
                    title={t('guide.sections.title')}
                    hint={t('guide.sections.hint')}
                />
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {guideSections.map((section) => (
                        <GuideSectionCard key={section.id} section={section} />
                    ))}
                </div>
            </section>
        </PageShell>
    );
}
