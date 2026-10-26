// -Path: 'client/app/pages/guide/components/GuideSteps.tsx'
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import { guideSteps } from '~/data/guide';

/**
 * The quick start: four numbered cards that walk a new learner through their
 * first session (pick a language → read the chart → drill → review). Each card
 * links to the page it talks about, so the guide is never a dead end.
 */
export default function GuideSteps() {
    const { t } = useTranslation();

    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {guideSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                    <Link
                        key={step.id}
                        to={step.to}
                        className='group flex h-full flex-col rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:border-primary hover:bg-surface-overlay'
                    >
                        <div className='mb-5 flex items-center justify-between'>
                            <span className='flex h-11 w-11 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-primary-emphasis'>
                                <Icon className='h-5 w-5' />
                            </span>
                            <span className='font-mono text-xs font-bold tracking-[0.14em] text-surface-muted tabular-nums'>
                                0{index + 1}
                            </span>
                        </div>
                        <h3 className='text-base font-bold tracking-tight text-surface-foreground'>
                            {t(`guide.steps.${step.id}.title`)}
                        </h3>
                        <p className='mt-1.5 text-sm leading-relaxed text-surface-muted'>
                            {t(`guide.steps.${step.id}.hint`)}
                        </p>
                    </Link>
                );
            })}
        </div>
    );
}
