// -Path: 'client/app/routes/page/japanese/vocabulary/list.tsx'
import VocabularyListPage from '~/pages/japanese/vocabulary/VocabularyList';
import type { Route } from './+types/list';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary List' },
        { name: 'description', content: 'Browse Japanese vocabulary words and meanings.' },
    ];
}

export default function VocabularyList() {
    return <VocabularyListPage />;
}
