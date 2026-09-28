// -Path: 'client/app/routes/page/japanese/review.tsx'
import type { Route } from './+types/review';
import DeckListPage from '~/pages/japanese/review/DeckList';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Deck' },
        {
            name: 'description',
            content: 'Pick a vocabulary deck and review with flashcards and spaced repetition.',
        },
    ];
}

export default function VocabularyReview() {
    return <DeckListPage />;
}