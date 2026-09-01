// -Path: 'client/app/routes/page/japanese/characters.tsx'
import CharactersPage from '~/pages/japanese/characters/Characters';
import type { Route } from './+types/characters';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Learn Choco - Japanese Characters' },
        { name: 'description', content: 'Browse Hiragana and Katakana characters.' },
    ];
}

export default function Characters() {
    return <CharactersPage />;
}
