// -Path: 'client/app/routes/page/review/review.tsx'
import type { Route } from './+types/review';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Review' },
        {
            name: 'description',
            content: 'Pick a vocabulary deck and review with flashcards and spaced repetition.',
        },
    ];
}

export default function Review() {
    return <DeckListPage type='review' />;
}
