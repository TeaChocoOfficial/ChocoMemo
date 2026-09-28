// -Path: 'client/app/routes/page/japanese/kana-drill.tsx'
import type { Route } from './+types/drill';
import KanaDrillPage from '~/pages/japanese/drill/KanaDrill';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Kana Drill' },
        { name: 'description', content: 'Test your Hiragana and Katakana recognition.' },
    ];
}

export default function KanaDrill() {
    return <KanaDrillPage />;
}
