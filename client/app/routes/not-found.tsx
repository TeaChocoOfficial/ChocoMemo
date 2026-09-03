// -Path: 'Vite-React-Router-TypeScript/app/routes/not-found.tsx'
import NotfoundPage from '~/pages/Notfound';
import type { Route } from './+types/not-found';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Not Found' },
        { name: 'description', content: 'The requested page could not be found.' },
    ];
}

export default function NotFound() {
    return <NotfoundPage />;
}
