// -Path: 'Vite-React-TypeScript/src/pages/auth/Auth.tsx'
import { useEffect } from 'react';
import AuthHero from './AuthHero';
import type { User } from '~/types/auth';
import LeftPanel from './panel/LeftPanel';
import RightPanel from './panel/RightPanel';
import { useAuthStore } from '~/stores/auth.store';

export default function AuthPage() {
    const { setUser } = useAuthStore();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            setUser({
                userId: payload.userId,
                name: payload.name,
                email: payload.email,
                avatar: payload.avatar,
                createdAt: payload.createdAt ? new Date(payload.createdAt) : undefined,
                updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : undefined,
            } satisfies User);
        } catch (error) {
            console.error('Failed to parse token:', error);
        }

        if (window.location.search.includes('token='))
            window.history.replaceState({}, '', window.location.pathname);
    }, []);

    return (
        <section className='relative min-h-screen flex items-start justify-center overflow-hidden py-16 sm:py-20'>
            <div className='absolute inset-0 -z-10'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2' />
                <div className='absolute bottom-0 left-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3' />
            </div>

            <div className='mx-auto max-w-6xl px-4 sm:px-6 w-full'>
                <AuthHero />
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto'>
                    <LeftPanel />
                    <RightPanel />
                </div>
            </div>
        </section>
    );
}
