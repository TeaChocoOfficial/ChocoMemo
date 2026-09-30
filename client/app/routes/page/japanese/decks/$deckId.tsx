// -Path: 'client/app/routes/page/japanese/decks/$deckId.tsx'
import type { Route } from './+types/$deckId';
import DeckDetailsPage from '~/pages/decks/DeckDetailsPage';
import { Languages } from '~/data/language';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Deck' },
        { name: 'description', content: 'What is in this deck, and who made it.' },
    ];
}

export default function JapaneseDeckDetails({ params }: Route.ComponentProps) {
    // The track is fixed by the route this file is registered under, so the
    // `:lang` segment is the UI locale and says nothing about the content.
    return <DeckDetailsPage deckId={params.deckId} language={Languages.ja} />;
}
