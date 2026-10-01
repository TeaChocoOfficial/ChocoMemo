// -Path: 'client/app/routes/page/english/review/review.tsx'
import DeckListPage from '~/components/page/DeckListPage';
import { Languages } from '~/data/language';
import type { Route } from './+types/review';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Review' },
        { name: 'description', content: 'Review English vocabulary decks.' },
    ];
}

export default function EnglishReview() {
    return <DeckListPage type='review' language={Languages.en} />;
}
