// -Path: 'client/app/routes/page/characters/$target.tsx'
import type { Route } from './+types/$target';
import CharacterChart from '~/pages/characters/CharacterChart';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Characters' },
        { name: 'description', content: 'Browse a language character chart.' },
    ];
}

export default function Characters() {
    return <CharacterChart />;
}
