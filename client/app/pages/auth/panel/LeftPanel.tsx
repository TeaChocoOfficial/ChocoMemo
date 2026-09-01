// -Path: 'Vite-React-TypeScript/src/pages/auth/LeftPanel.tsx'
import { useState } from 'react';
import type { Message } from '../type';
import { motion } from 'framer-motion';
import Card from '~/components/custom/Card';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '~/stores/auth.store';
import LoginForm from '../components/content/LoginForm';
import LeftSkeleton from '../components/custom/LeftSkeleton';
import { authAPI, type LoginPayload } from '~/services/auth';
import AuthStatusPanel from '../components/content/AuthStatusPanel';

export default function LeftPanel() {
    const { t } = useTranslation();
    const { user, loading, setUser } = useAuthStore();
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setFormLoading(true);
        setMessage(null);

        try {
            const res = await authAPI.login(form);
            setUser(res.data.user);
            setMessage({ type: 'success', text: res.data.message || t('auth.login_success') });
            setForm({ email: '', password: '' });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const msg = error?.response?.data?.message || t('auth.login_failed');
            setMessage({ type: 'error', text: msg });
        } finally {
            setFormLoading(false);
        }
    };

    const handleLogout = async () => {
        setFormLoading(true);
        setMessage(null);

        try {
            await authAPI.logout();
            setUser(null);
            setMessage({ type: 'success', text: t('auth.logout_success') });
        } catch {
            setMessage({ type: 'error', text: t('auth.logout_failed') });
        } finally {
            setFormLoading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

    const handleGoogleLogin = () => authAPI.googleLogin();

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='space-y-6'
        >
            <Card className='p-8'>
                {loading ? (
                    <LeftSkeleton />
                ) : user ? (
                    <AuthStatusPanel
                        message={message}
                        loading={formLoading}
                        onLogout={handleLogout}
                        setMessage={setMessage}
                    />
                ) : (
                    <LoginForm
                        form={form}
                        message={message}
                        loading={formLoading}
                        onSubmit={handleLogin}
                        onChange={handleChange}
                        onGoogleLogin={handleGoogleLogin}
                    />
                )}
            </Card>
        </motion.div>
    );
}
