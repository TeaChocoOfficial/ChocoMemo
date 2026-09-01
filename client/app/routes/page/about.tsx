// -Path: 'Vite-React-Router-TypeScript/app/routes/about.tsx'
import AboutPage from '~/pages/about/About';
import type { Route } from './+types/about';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'React Router App - About' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function About() {
    return <AboutPage />;
}
