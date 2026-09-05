// -Path: 'client/app/routes/page/japanese/vocabulary-review.tsx'
import type { Route } from './+types/vocabulary-review';
import VocabularyReviewPage from '~/pages/japanese/vocabulary-review/VocabularyReview';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Review' },
        {
            name: 'description',
            content: 'Review Japanese vocabulary with flashcards and spaced repetition.',
        },
    ];
}

export default function VocabularyReview() {
    return <VocabularyReviewPage />;
}
