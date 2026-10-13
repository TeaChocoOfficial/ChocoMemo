// -Path: 'client/app/components/page/HubNav.tsx'
import { useTranslation } from 'react-i18next';
import { Languages, targetLanguage } from '~/data/language';
import NavRow from '~/components/container/NavRow';
import Stats from '~/pages/hub/Stats';
import SectionHeading from '~/components/custom/SectionHeading';
import { useTargetLang } from '~/hooks/useTargetLang';
import { targetCode, withTarget } from '~/utils/targetLang';
import {
    FaBolt,
    FaBookOpen,
    FaArrowsRotate,
    FaBookOpenReader,
    FaChartSimple,
    FaClipboardCheck,
    FaPenToSquare,
} from 'react-icons/fa6';

/** One destination row on the hub. `id` doubles as the i18n key suffix under
 *  `<targetLang>.nav.<id>`, so a row's copy follows the target language. */
interface HubItem {
    id: string;
    to: string;
    icon: React.ReactNode;
}

/**
 * The hub's destination rows, driven by the active target language's
 * capabilities: a language without a character set (English today) hides the
 * character chart and drill, and a language that is not ready shows a
 * coming-soon notice instead of links that would 404.
 */
export default function HubNav() {
    const { t } = useTranslation();
    const targetLang = useTargetLang();
    const config = targetLanguage(targetLang);
    const code = targetCode(targetLang);
    const set = config?.characterSet;

    if (config?.status !== 'ready') {
        return (
            <p className='rounded-sm border border-dashed border-line-strong px-4 py-6 text-center text-sm text-surface-muted'>
                {t('hub.comingSoon', {
                    language: t(`languageSelect.languages.${targetLang}.name`),
                })}
            </p>
        );
    }

    const learn: HubItem[] = [
        ...(set
            ? [
                  {
                      id: set,
                      to: `/characters/${code}`,
                      icon: <FaChartSimple className='w-5 h-5' />,
                  },
              ]
            : []),
        {
            id: 'vocab',
            to: withTarget('/vocab', targetLang),
            icon: <FaBookOpen className='w-5 h-5' />,
        },
        {
            id: 'render',
            to: withTarget('/render', targetLang),
            icon: <FaBookOpenReader className='w-5 h-5' />,
        },
    ];

    const practice: HubItem[] = [
        ...(set
            ? [{ id: 'drill', to: `/drill/${code}`, icon: <FaBolt className='w-5 h-5' /> }]
            : []),
        {
            id: 'review',
            to: withTarget('/review', targetLang),
            icon: <FaArrowsRotate className='w-5 h-5' />,
        },
        {
            id: 'exam',
            to: withTarget('/exam', targetLang),
            icon: <FaClipboardCheck className='w-5 h-5' />,
        },
    ];

    const manage: HubItem[] = [
        { id: 'edit', to: '/edit', icon: <FaPenToSquare className='w-5 h-5' /> },
    ];

    const row = (item: HubItem, index: number) => (
        <NavRow
            key={item.id}
            index={index}
            icon={item.icon}
            to={item.to}
            title={t(`${targetLang}.nav.${item.id}.title`)}
            action={t(`${targetLang}.nav.${item.id}.action`)}
            description={t(`${targetLang}.nav.${item.id}.description`)}
        />
    );

    return (
        <>
            {targetLang === Languages.ja && <Stats />}

            <div className='mb-12'>
                <SectionHeading step='01' label={t(`${targetLang}.sections.learn`)} />
                <div className='space-y-3'>{learn.map(row)}</div>
            </div>

            <div className='mb-12'>
                <SectionHeading step='02' label={t(`${targetLang}.sections.practice`)} />
                <div className='space-y-3'>{practice.map(row)}</div>
            </div>

            <div>
                <SectionHeading step='03' label={t(`${targetLang}.sections.manage`)} />
                <div className='space-y-3'>{manage.map(row)}</div>
            </div>
        </>
    );
}
