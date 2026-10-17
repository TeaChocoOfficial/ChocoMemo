// -Path: 'client/app/pages/study/components/DeckGroup.tsx'
import { useTranslation } from 'react-i18next';
import DeckLink from './DeckLink';
import StudySectionHeading from './StudySectionHeading';
import type { Languages } from '~/data/language';
import { withTarget } from '~/utils/config/targetLang';
import {
    FaBookOpen,
    FaArrowsRotate,
    FaBookOpenReader,
    FaClipboardCheck,
    FaPenToSquare,
} from 'react-icons/fa6';

/** Two columns of deck destinations, collapsing to one below `sm` (640px). */
const COLUMNS = 'grid gap-4 sm:grid-cols-2';

/**
 * The Decks group: a Learn column (vocabulary, render), a Practice column
 * (review, exam), and a full-width Manage row (edit decks). Every deck link
 * carries the active target as `?target=`, and the heading states which
 * language the decks are for.
 */
export default function DeckGroup({
    targetLang,
    languageName,
}: {
    targetLang: Languages;
    languageName: string;
}) {
    const { t } = useTranslation();

    const learn = [
        {
            id: 'vocab',
            to: withTarget('/vocab', targetLang),
            icon: <FaBookOpen className='h-5 w-5' />,
        },
        {
            id: 'render',
            to: withTarget('/render', targetLang),
            icon: <FaBookOpenReader className='h-5 w-5' />,
        },
    ];
    const practice = [
        {
            id: 'review',
            to: withTarget('/review', targetLang),
            icon: <FaArrowsRotate className='h-5 w-5' />,
        },
        {
            id: 'exam',
            to: withTarget('/exam', targetLang),
            icon: <FaClipboardCheck className='h-5 w-5' />,
        },
    ];

    const column = (id: 'learn' | 'practice', items: typeof learn) => (
        <div>
            <p className='mb-3 text-xs font-semibold text-surface-muted'>{t(`study.decks.${id}`)}</p>
            <div className='space-y-3'>
                {items.map((item) => (
                    <DeckLink
                        key={item.id}
                        to={item.to}
                        icon={item.icon}
                        title={t(`study.decks.items.${item.id}.title`)}
                        description={t(`study.decks.items.${item.id}.description`)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <section>
            <StudySectionHeading
                title={t('study.decks.title')}
                description={t('study.decks.for', { language: languageName })}
            />
            <div className={COLUMNS}>
                {column('learn', learn)}
                {column('practice', practice)}
            </div>
            <div className='mt-4'>
                <DeckLink
                    dashed
                    to='/edit'
                    icon={<FaPenToSquare className='h-5 w-5' />}
                    title={t('study.decks.items.edit.title')}
                    description={t('study.decks.items.edit.description')}
                />
            </div>
        </section>
    );
}
