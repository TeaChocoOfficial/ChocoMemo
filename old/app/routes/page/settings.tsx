import SettingsPage from '~/pages/settings/Settings';
import type { Route } from './+types/settings';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Settings' },
        { name: 'description', content: 'Brew ChocoMemo to your taste.' },
    ];
}

export default function Settings() {
    return <SettingsPage />;
}