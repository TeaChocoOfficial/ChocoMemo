// -Path: 'client/app/routes/page/japanese/render.tsx'
import { Languages } from '~/data/language';
import type { Route } from './+types/render';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Render' },
        { name: 'description', content: 'Reading decks for Japanese practice.' },
    ];
}

export default function JapaneseRender() {
    return <DeckListPage type='render' language={Languages.ja} />;
}
