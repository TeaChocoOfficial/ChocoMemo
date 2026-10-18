// -Path: 'client/app/components/container/TargetLangSelect.tsx'
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import Select, { type OptionSelectType } from '~/components/custom/Select';
import { FaGlobe } from 'react-icons/fa6';
import { ALL_TARGETS, languages, type TargetFilter } from '~/data/language';
import { useDeckTargetLang, useTargetLang } from '~/hooks/base/useTargetLang';
import { targetCode } from '~/utils/config/targetLang';
import { useDeckListStore } from '~/stores/config/deckList.store';

/**
 * The single target-language control, shared by the deck list and the study
 * hub. It shows the active target and, on change, persists the choice and
 * writes `?target=` back to the URL so the link stays shareable. With
 * `allowAll` it also offers the deck-list "all languages" option, which the
 * study hub has no use for.
 */
export default function TargetLangSelect({
    className,
    allowAll = false,
}: {
    className?: string;
    /** Offer the deck-list "all languages" option. Off by default, because a
     *  study surface always needs one concrete target. */
    allowAll?: boolean;
}) {
    const { t } = useTranslation();
    const targetLang = useTargetLang();
    const { save } = useDeckListStore();
    const deckTarget = useDeckTargetLang();
    const [searchParams, setSearchParams] = useSearchParams();

    const allOption: OptionSelectType<TargetFilter> = {
        value: ALL_TARGETS,
        label: t('language.all'),
        icon: <FaGlobe className='h-3.5 w-3.5' />,
    };

    const options: OptionSelectType<TargetFilter>[] = [
        ...(allowAll ? [allOption] : []),
        ...languages.map((language) => ({
            value: language.id,
            label: t(`language.${language.id}`),
            icon: <span className='text-base font-black leading-none'>{language.glyph}</span>,
        })),
    ];

    const handleChange = (id: TargetFilter) => {
        save({ targetLang: id });
        const next = new URLSearchParams(searchParams);
        next.set('target', targetCode(id));
        setSearchParams(next, { preventScrollReset: true });
    };

    return (
        <Select<TargetFilter>
            options={options}
            value={allowAll ? deckTarget : targetLang}
            className={className}
            onChange={handleChange}
            placeholder={t('deck.target')}
            icon={<FaGlobe className='h-3.5 w-3.5' />}
        />
    );
}
