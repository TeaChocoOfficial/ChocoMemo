// -Path: 'client/app/pages/study/components/StatusPill.tsx'
import { useTranslation } from 'react-i18next';

/**
 * A lowercase status tag for a study item: "Current" for the active item,
 * "Ready" otherwise. Deliberately not the uppercase mono `Badge` used
 * elsewhere on the site.
 */
export default function StatusPill({ active }: { active: boolean }) {
    const { t } = useTranslation();

    const label = active ? t('study.tag.current') : t('study.tag.ready');

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                active ? 'border-primary/50 text-primary' : 'border-line-strong text-surface-muted'
            }`}
        >
            {label}
        </span>
    );
}
