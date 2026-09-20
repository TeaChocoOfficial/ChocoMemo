import toast from 'react-hot-toast';
import { authAPI } from '~/services/auth';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '~/stores/auth.store';

export const useSignOut = () => {
    const { t } = useTranslation();
    const { setUser } = useAuthStore();

    return async () => {
        try {
            await authAPI.logout();
            toast.success(t('auth.signOut'));
            setUser(null);
        } catch {
            toast.error(t('auth.error.generic'));
        }
    };
};
