// -Path: 'client/app/pages/characters/components/FallbackActions.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowRight } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

/** Props for {@link FallbackActions}. */
interface FallbackActionsProps {
    /** Extra classes appended to the row, e.g. a top margin. */
    className?: string;
    /** Quiet secondary link, e.g. the kana feature that does exist. */
    secondaryTo?: string;
    /** Label for the secondary link; rendered only alongside `secondaryTo`. */
    secondaryLabel?: string;
}

/** Primary "Back to Study" link, styled like the Home CTA pair. */
const PRIMARY =
    'inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-emphasis sm:w-auto';

/** Secondary text action: no fill, so it never competes with the primary. */
const SECONDARY =
    'inline-flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3 text-base font-semibold text-surface-muted transition-colors duration-200 hover:text-primary sm:w-auto';

/**
 * The action row shared by both fallback panels: a primary "Back to Study"
 * link, plus an optional quiet link to the feature that is actually live.
 *
 * @param props - FallbackActions props.
 * @returns The rendered action row.
 */
export default function FallbackActions({
    secondaryTo,
    secondaryLabel,
    className = '',
}: FallbackActionsProps) {
    const { t } = useTranslation();

    /** Stacked on phones, side-by-side from the `sm` breakpoint up. */
    const rowClassName = `flex flex-col items-center justify-center gap-2 sm:flex-row ${className}`;

    return (
        <div className={rowClassName}>
            {/** Primary escape hatch back to the study hub. */}
            <Link to='/study' className={PRIMARY}>
                {t('characters.backHub')}
                <FaArrowRight className='h-4 w-4' />
            </Link>
            {/** Optional pointer to the one implemented script, when offered. */}
            {secondaryTo && secondaryLabel && (
                <Link to={secondaryTo} className={SECONDARY}>
                    {secondaryLabel}
                </Link>
            )}
        </div>
    );
}
