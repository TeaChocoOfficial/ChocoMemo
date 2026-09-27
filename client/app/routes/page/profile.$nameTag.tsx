// -Path: 'client/app/routes/page/profile.$nameTag.tsx'
import PublicProfile from '~/pages/profile/PublicProfile';
import type { Route } from './+types/profile.$nameTag';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `${params.nameTag} - ChocoMemo` },
        { name: 'description', content: 'A member profile on ChocoMemo.' },
    ];
}

export default function PublicProfileByNameTag() {
    return <PublicProfile />;
}
