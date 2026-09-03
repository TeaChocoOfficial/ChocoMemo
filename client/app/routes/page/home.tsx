// -Path: 'Vite-React-Router-TypeScript/app/routes/home.tsx'
import HomePage from '~/pages/home/Home';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Home' },
        { name: 'description', content: 'Welcome to ChocoMemo, your language learning companion.' },
    ];
}

export default function Home() {
    return <HomePage />;
}
