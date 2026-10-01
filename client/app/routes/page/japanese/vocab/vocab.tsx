// -Path: 'client/app/routes/page/japanese/vocabulary.tsx'
import { Languages } from '~/data/language';
import type { Route } from './+types/vocab';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary' },
        { name: 'description', content: 'Browse vocabulary decks and their words.' },
    ];
}

export default function JapaneseVocab() {
    return <DeckListPage type='vocab' language={Languages.ja} />;
}
