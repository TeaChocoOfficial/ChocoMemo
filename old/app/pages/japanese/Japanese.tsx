// -Path: 'client/app/pages/japanese/Japanese.tsx'
import {
    FaBolt,
    FaBookOpen,
    FaArrowsRotate,
    FaBookOpenReader,
    FaClipboardCheck,
} from 'react-icons/fa6';
import Stats from './Stats';
import { Languages } from '~/data/language';
import MainPage from '~/components/page/MainPage';

/**
 * Japanese hub: overall progress, then every destination split by what the
 * visitor came to do — read something new (Learn) or test themselves
 * (Practice). Copy for each row is translated here so the row component stays
 * presentation-only.
 */
export default function JapanesePage() {
    const learn = [
        { id: 'kana', icon: <span className='text-2xl font-black leading-none'>あ</span> },
        { id: 'vocab', icon: <FaBookOpen className='w-5 h-5' /> },
        { id: 'render', icon: <FaBookOpenReader className='w-5 h-5' /> },
    ];

    const practice = [
        { id: 'drill', icon: <FaBolt className='w-5 h-5' /> },
        { id: 'review', icon: <FaArrowsRotate className='w-5 h-5' /> },
        { id: 'exam', icon: <FaClipboardCheck className='w-5 h-5' /> },
    ];

    return <MainPage language={Languages.ja} learn={learn} practice={practice} stats={<Stats />} />;
}
