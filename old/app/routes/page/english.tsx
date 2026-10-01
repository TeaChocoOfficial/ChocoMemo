// -Path: 'client/app/routes/page/english.tsx'
import EnglishPage from '~/pages/english/English';
import type { Route } from './+types/english';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - English' },
        { name: 'description', content: 'Learn English with ChocoMemo.' },
    ];
}

export default function English() {
    return <EnglishPage />;
}
