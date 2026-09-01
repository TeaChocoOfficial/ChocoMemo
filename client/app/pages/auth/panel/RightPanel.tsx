// -Path: 'Vite-React-TypeScript/src/pages/auth/RightPanel.tsx'
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Message } from '../type';
import Card from '~/components/custom/Card';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '~/stores/auth.store';
import RegisterForm from '../components/content/RegisterForm';
import RightSkeleton from '../components/custom/RightSkeleton';
import AuthDataPanel from '../components/content/AuthDataPanel';
import { authAPI, type RegisterPayload } from '~/services/auth';

export default function RightPanel() {
    const { t } = useTranslation();
    const { user, loading, setUser } = useAuthStore();
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [form, setForm] = useState<RegisterPayload>({ name: '', email: '', password: '' });

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormLoading(true);
        setMessage(null);

        try {
            const res = await authAPI.register(form);
            setUser(res.data.user);
            setMessage({ type: 'success', text: res.data.message || t('auth.register_success') });
            setForm({ name: '', email: '', password: '' });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const msg = error?.response?.data?.message || t('auth.register_failed');
            setMessage({ type: 'error', text: msg });
        } finally {
            setFormLoading(false);
        }
    };

    const handleRegisterChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='space-y-6'
        >
            <Card className='p-8'>
                {loading ? (
                    <RightSkeleton />
                ) : user ? (
                    <AuthDataPanel message={message} />
                ) : (
                    <RegisterForm
                        form={form}
                        message={message}
                        loading={formLoading}
                        onSubmit={handleRegister}
                        onChange={handleRegisterChange}
                    />
                )}
            </Card>
        </motion.div>
    );
}
