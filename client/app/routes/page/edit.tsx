// -Path: 'client/app/routes/page/edit.tsx'
import type { Route } from './+types/edit';
import EditPage from '~/components/page/EditPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Edit Decks' },
        { name: 'description', content: 'Edit your decks.' },
    ];
}

export default function Edit() {
    return <EditPage />;
}
