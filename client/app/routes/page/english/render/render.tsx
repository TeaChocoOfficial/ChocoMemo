// -Path: 'client/app/routes/page/english/render/render.tsx'
import DeckListPage from '~/components/page/DeckListPage';
import { Languages } from '~/data/language';
import type { Route } from './+types/render';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Render' },
        { name: 'description', content: 'English reading decks.' },
    ];
}

export default function EnglishRender() {
    return <DeckListPage type='render' language={Languages.en} />;
}
