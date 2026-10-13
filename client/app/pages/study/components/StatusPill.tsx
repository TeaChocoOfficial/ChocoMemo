// -Path: 'client/app/pages/study/components/StatusPill.tsx'
import { useTranslation } from 'react-i18next';
import type { TargetStatus } from '~/data/language';

/**
 * A lowercase status tag for a study item: "Current" for the active ready item,
 * "Ready" for another ready item, "Coming Soon" otherwise. Deliberately not the
 * uppercase mono `Badge` used elsewhere on the site.
 */
export default function StatusPill({ status, active }: { status: TargetStatus; active: boolean }) {
    const { t } = useTranslation();
    const ready = status === 'ready';
    const current = ready && active;
    const label = current
        ? t('study.tag.current')
        : ready
          ? t('study.tag.ready')
          : t('study.tag.comingSoon');

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                ready ? 'border-primary/50 text-primary' : 'border-line-strong text-surface-muted'
            }`}
        >
            {label}
        </span>
    );
}
