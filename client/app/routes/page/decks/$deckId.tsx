// -Path: 'client/app/routes/page/decks/$deckId.tsx'
import type { Route } from './+types/$deckId';
import DeckDetailsPage from '~/pages/decks/DeckDetailsPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Deck' },
        { name: 'description', content: 'What is in this deck, and who made it.' },
    ];
}

export default function DeckDetails({ params }: Route.ComponentProps) {
    return <DeckDetailsPage deckId={params.deckId} />;
}
