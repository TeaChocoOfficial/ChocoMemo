// -Path: 'client/app/routes/page/japanese/render.tsx'
import type { Route } from './+types/render';
import RenderDeckList from '~/pages/japanese/render/DeckList';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Render' },
        { name: 'description', content: 'Reading decks for Japanese practice.' },
    ];
}

export default function Render() {
    return <RenderDeckList />;
}
