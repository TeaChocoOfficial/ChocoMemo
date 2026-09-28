// -Path: 'client/app/routes/page/japanese/render.$deckId.tsx'
import type { Route } from './+types/render.$deckId';
import RenderDeckReader from '~/pages/japanese/render/RenderDeckReader';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Render' },
        { name: 'description', content: 'Read short passages with furigana.' },
    ];
}

export default function RenderDeckById() {
    return <RenderDeckReader />;
}
