// -Path: 'client/app/routes/page/japanese/vocabulary.$deckId.tsx'
import type { Route } from './+types/vocab.$deckId';
import VocabDeck from '~/pages/japanese/vocab/VocabDeck';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Deck' },
        { name: 'description', content: 'Words in this deck, with readings and examples.' },
    ];
}

export default function VocabDeckById() {
    return <VocabDeck />;
}
