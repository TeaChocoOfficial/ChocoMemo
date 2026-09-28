// -Path: 'client/app/routes/page/japanese/review.$deckId.tsx'
import type { Route } from './+types/review.$deckId';
import VocabularyReviewPage from '~/pages/japanese/review/VocabularyReview';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Review' },
        {
            name: 'description',
            content: `Review the "${params.deckId}" vocabulary deck with flashcards and spaced repetition.`,
        },
    ];
}

export default function VocabularyReviewDeck() {
    return <VocabularyReviewPage />;
}