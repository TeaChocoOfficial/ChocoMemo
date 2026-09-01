// -Path: 'client/app/routes/page/japanese.tsx'
import JapanesePage from '~/pages/japanese/Japanese';
import type { Route } from './+types/japanese';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Learn Choco - Japanese' },
        { name: 'description', content: 'Learn Japanese with TeaChoco.' },
    ];
}

export default function Japanese() {
    return <JapanesePage />;
}
