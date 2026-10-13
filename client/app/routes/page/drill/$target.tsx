// -Path: 'client/app/routes/page/drill/$target.tsx'
import type { Route } from './+types/$target';
import CharacterDrill from '~/pages/drill/CharacterDrill';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Character Drill' },
        { name: 'description', content: 'Test your character recognition.' },
    ];
}

export default function Drill() {
    return <CharacterDrill />;
}
