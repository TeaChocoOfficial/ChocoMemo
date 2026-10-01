// -Path: 'client/app/routes/page/english/vocab/vocab.tsx'
import type { Route } from './+types/vocab';
import { Languages } from '~/data/language';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary' },
        { name: 'description', content: 'Browse English vocabulary decks.' },
    ];
}

export default function EnglishVocab() {
    return <DeckListPage type='vocab' language={Languages.en} />;
}
