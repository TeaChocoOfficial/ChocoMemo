// -Path: 'Vite-React-Router-TypeScript/app/routes/not-found.tsx'
import NotfoundPage from '~/pages/Notfound';
import type { Route } from './+types/not-found';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'React Router App - Not Found' },
        { name: 'description', content: 'Page not found' },
    ];
}

export default function NotFound() {
    return <NotfoundPage />;
}
