// -Path: 'client/app/routes/page/vocab/vocab.tsx'
import type { Route } from './+types/vocab';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary' },
        { name: 'description', content: 'Browse vocabulary decks and their words.' },
    ];
}

export default function Vocab() {
    return <DeckListPage type='vocab' />;
}
