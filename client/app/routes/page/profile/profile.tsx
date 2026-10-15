import type { Route } from './+types/profile';
import ProfilePage from '~/pages/profile/Profile';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Profile' },
        { name: 'description', content: 'Your learning story with ChocoMemo.' },
    ];
}

export default function Profile() {
    return <ProfilePage />;
}