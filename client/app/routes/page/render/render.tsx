// -Path: 'client/app/routes/page/render/render.tsx'
import type { Route } from './+types/render';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Render' },
        { name: 'description', content: 'Reading decks for practice.' },
    ];
}

export default function Render() {
    return <DeckListPage type='render' />;
}
