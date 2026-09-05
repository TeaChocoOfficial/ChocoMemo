// -Path: 'client/app/routes/page/japanese/kana.tsx'
import KanaPage from '~/pages/japanese/kana/Kana';
import type { Route } from './+types/kana';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Japanese Kana' },
        { name: 'description', content: 'Browse Hiragana and Katakana.' },
    ];
}

export default function Kana() {
    return <KanaPage />;
}
