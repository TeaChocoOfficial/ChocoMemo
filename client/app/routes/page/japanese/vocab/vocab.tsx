// -Path: 'client/app/routes/page/japanese/vocabulary.tsx'
import type { Route } from './+types/vocab';
import VocabularyDeckList from '~/pages/japanese/vocab/DeckList';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary' },
        { name: 'description', content: 'Browse vocabulary decks and their words.' },
    ];
}

export default function Vocabulary() {
    return <VocabularyDeckList />;
}
