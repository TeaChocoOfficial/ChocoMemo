// -Path: 'client/app/pages/guide/components/GuideSectionCard.tsx'
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import Badge from '~/components/custom/Badge';
import { FaCircleRight } from 'react-icons/fa6';
import type { GuideSection } from '~/data/guide';

/**
 * One area of the app: the icon, the title, the one-line hint, the bullet
 * points and a link to the page itself. Every card is the same shape so the
 * guide reads as a list of equals rather than a mix of feature blurbs.
 */
export default function GuideSectionCard({ section }: { section: GuideSection }) {
    const { t } = useTranslation();
    const Icon = section.icon;
    const points = Array.from({ length: section.points }, (_, index) => index + 1);

    return (
        <article className='flex h-full flex-col rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:border-primary'>
            <div className='flex items-center justify-between gap-3'>
                <span className='flex h-11 w-11 items-center justify-center rounded-sm bg-primary-subtle text-primary'>
                    <Icon className='h-5 w-5' />
                </span>
                {section.soon && <Badge variant='warning'>{t('guide.action.comingSoon')}</Badge>}
            </div>

            <h3 className='mt-5 text-base font-bold tracking-tight text-surface-foreground'>
                {t(`guide.sections.${section.id}.title`)}
            </h3>
            <p className='mt-1.5 text-sm leading-relaxed text-surface-muted'>
                {t(`guide.sections.${section.id}.hint`)}
            </p>

            <ul className='mt-4 flex-1 space-y-2'>
                {points.map((point) => (
                    <li
                        key={point}
                        className='flex gap-2.5 text-sm leading-relaxed text-surface-subtle'
                    >
                        <span aria-hidden='true' className='mt-2 h-px w-3 shrink-0 bg-line-strong' />
                        <span>{t(`guide.sections.${section.id}.point${point}`)}</span>
                    </li>
                ))}
            </ul>

            <Link
                to={section.to}
                className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-emphasis'
            >
                {t('guide.action.open')}
                <FaCircleRight className='h-3.5 w-3.5' />
            </Link>
        </article>
    );
}
