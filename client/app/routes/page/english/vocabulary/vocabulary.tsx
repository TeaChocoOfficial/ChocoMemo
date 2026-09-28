// -Path: 'client/app/routes/page/english/vocab/vocab.tsx'
import type { Route } from './+types/vocabulary';
import VocabularyDeckList from '~/pages/english/vocabulary/DeckList';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary' },
        { name: 'description', content: 'Browse English vocabulary decks.' },
    ];
}

export default function EnglishVocabulary() {
    return <VocabularyDeckList />;
}
