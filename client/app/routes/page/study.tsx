// -Path: 'client/app/routes/page/study.tsx'
import StudyHub from '~/pages/study/StudyHub';
import type { Route } from './+types/study';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Study' },
        { name: 'description', content: 'Pick what to study for the active language.' },
    ];
}

export default function Study() {
    return <StudyHub />;
}
