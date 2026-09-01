// -Path: 'Vite-React-Router-TypeScript/app/routes/auth.tsx'
import AuthPage from '~/pages/auth/Auth';
import type { Route } from './+types/auth';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'React Router App - Auth' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function Auth() {
    return <AuthPage />;
}
