// -Path: 'client/app/pages/japanese/render/DeckList.tsx'
import { Languages } from '~/data/language';
import DeckListPage from '~/components/page/DeckListPage';

export default function RenderDeckList() {
    return <DeckListPage type='render' language={Languages.ja} />;
}
