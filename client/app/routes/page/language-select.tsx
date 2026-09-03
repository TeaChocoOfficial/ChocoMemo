// -Path: 'client/app/routes/page/language-select.tsx'
import LanguageSelectPage from '~/pages/language-select/LanguageSelect';
import type { Route } from './+types/language-select';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Choose a Language' },
        { name: 'description', content: 'Pick the language you want to learn.' },
    ];
}

export default function LanguageSelect() {
    return <LanguageSelectPage />;
}
