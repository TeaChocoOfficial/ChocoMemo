// -Path: 'client/app/pages/home/SectionPill.tsx'
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';

/**
 * The one "Coming soon" pill for the Home page. A live feature leaves it out; an
 * upcoming one shows it, so a reader who skips the sentence still sees the
 * feature is not live yet.
 */
export default function SectionPill() {
    const { t } = useTranslation();

    return (
        <Badge variant='warning' className='mt-3'>
            {t('home.comingSoon')}
        </Badge>
    );
}
