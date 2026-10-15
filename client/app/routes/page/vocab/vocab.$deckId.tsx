// -Path: 'client/app/routes/page/vocab/vocab.$deckId.tsx'
import type { Route } from './+types/vocab.$deckId';
import ComingSoonPage from '~/components/page/ComingSoonPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Deck' },
        { name: 'description', content: 'Words in this deck, with readings and examples.' },
    ];
}

export default function VocabById() {
    return <ComingSoonPage />;
}
