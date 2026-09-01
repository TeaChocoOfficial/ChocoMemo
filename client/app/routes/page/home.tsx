// -Path: 'Vite-React-Router-TypeScript/app/routes/home.tsx'
import HomePage from '~/pages/home/Home';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'React Router App - Home' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function Home() {
    return <HomePage />;
}
