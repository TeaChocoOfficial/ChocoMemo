// -Path: 'client/app/routes/page/guide.tsx'
import type { Route } from './+types/guide';
import GuidePage from '~/pages/guide/Guide';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Guide' },
        { name: 'description', content: 'How to use ChocoMemo: charts, drills, decks, review and exams.' },
    ];
}

export default function Guide() {
    return <GuidePage />;
}
