import ProfilePage from '~/pages/profile/Profile';
import type { Route } from './+types/profile';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Profile' },
        { name: 'description', content: 'Your learning story with ChocoMemo.' },
    ];
}

export default function Profile() {
    return <ProfilePage />;
}