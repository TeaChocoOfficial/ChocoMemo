// -Path: 'client/app/routes/page/japanese/render.$deckId.tsx'
import type { Route } from './+types/render.$deckId';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Render' },
        { name: 'description', content: 'Read short passages with furigana.' },
    ];
}

export default function JapaneseRenderById() {
    return <></>;
}
