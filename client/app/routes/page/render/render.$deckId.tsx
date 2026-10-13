// -Path: 'client/app/routes/page/render/render.$deckId.tsx'
import type { Route } from './+types/render.$deckId';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Render Deck' },
        { name: 'description', content: 'Read this deck and check yourself.' },
    ];
}

export default function RenderById() {
    return <></>;
}
