// -Path: 'client/app/pages/english/English.tsx'
import { Languages } from '~/data/language';
import MainPage from '~/components/page/MainPage';
import { FaArrowsRotate, FaBookOpen, FaBookOpenReader, FaClipboardCheck } from 'react-icons/fa6';

/**
 * English track hub: the same shape as the Japanese hub, so a track only
 * supplies its destinations and the layout stays shared. Deck lists read from
 * the language-keyed stores, so switching tracks is a data concern.
 */
export default function EnglishPage() {
    const learn = [
        { id: 'vocab', icon: <FaBookOpen className='w-5 h-5' /> },
        { id: 'render', icon: <FaBookOpenReader className='w-5 h-5' /> },
    ];

    const practice = [
        { id: 'review', icon: <FaArrowsRotate className='w-5 h-5' /> },
        { id: 'exam', icon: <FaClipboardCheck className='w-5 h-5' /> },
    ];

    return <MainPage language={Languages.en} learn={learn} practice={practice} />;
}
