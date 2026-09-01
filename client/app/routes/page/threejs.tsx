// -Path: "Vite-React-Router-TypeScript/app/routes/threejs.tsx"
import type { Route } from './+types/threejs';
import ThreejsPage from '~/pages/threejs/Threejs';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'React Router App - Threejs' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function Threejs() {
    return <ThreejsPage />;
}
