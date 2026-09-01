// -Path: "Vite-React-Router-TypeScript/app/routes/socket.tsx"
import type { Route } from './+types/socket';
import SocketPage from '~/pages/socket/Socket';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'React Router App - Socket' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function Socket() {
    return <SocketPage />;
}
