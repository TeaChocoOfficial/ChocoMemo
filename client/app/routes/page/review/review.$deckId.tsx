// -Path: 'client/app/routes/page/review/review.$deckId.tsx'
import type { Route } from './+types/review.$deckId';
import ComingSoonPage from '~/components/page/ComingSoonPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Review Deck' },
        { name: 'description', content: 'Flashcard and spaced review of this deck.' },
    ];
}

export default function ReviewById() {
    return <ComingSoonPage />;
}
