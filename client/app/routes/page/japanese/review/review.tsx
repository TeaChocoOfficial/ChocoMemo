// -Path: 'client/app/routes/page/japanese/review.tsx'
import { Languages } from '~/data/language';
import type { Route } from './+types/review';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Deck' },
        {
            name: 'description',
            content: 'Pick a vocabulary deck and review with flashcards and spaced repetition.',
        },
    ];
}

export default function JapaneseReview() {
    return <DeckListPage type='review' language={Languages.ja} />;
}
