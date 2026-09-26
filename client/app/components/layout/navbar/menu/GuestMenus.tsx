import Button from '../../../custom/Button';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '~/stores/auth.store';

export default function GuestMenus() {
    const { t } = useTranslation();
    const { setOpen } = useAuthStore();

    return (
        <div className='hidden sm:block'>
            <Button variant='primary' size='sm' onClick={() => setOpen(true)}>
                {t('auth.signIn')}
            </Button>
        </div>
    );
}
