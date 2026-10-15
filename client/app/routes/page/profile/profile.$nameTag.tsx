// -Path: 'client/app/routes/page/profile.$nameTag.tsx'
import type { Route } from './+types/profile.$nameTag';
import PublicProfile from '~/pages/profile/PublicProfile';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `${params.nameTag} - ChocoMemo` },
        { name: 'description', content: 'A member profile on ChocoMemo.' },
    ];
}

export default function PublicProfileByNameTag() {
    return <PublicProfile />;
}
