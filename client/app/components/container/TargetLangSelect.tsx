// -Path: 'client/app/components/container/TargetLangSelect.tsx'
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import Select from '~/components/custom/Select';
import { FaGlobe } from 'react-icons/fa6';
import { Languages, languages } from '~/data/language';
import { useTargetLang } from '~/hooks/useTargetLang';
import { targetCode } from '~/utils/targetLang';
import { useDeckListStore } from '~/stores/config/deckList.store';

/**
 * The single target-language control, shared by the deck list and the study
 * hub. It shows the active target and, on change, persists the choice and
 * writes `?target=` back to the URL so the link stays shareable. Languages that
 * are not ready are listed but disabled.
 */
export default function TargetLangSelect({ className }: { className?: string }) {
    const { t } = useTranslation();
    const targetLang = useTargetLang();
    const save = useDeckListStore((state) => state.save);
    const [searchParams, setSearchParams] = useSearchParams();

    const options = languages.map((language) => ({
        value: language.id,
        label: t(`nav.${language.id}`),
        icon: <span className='text-base font-black leading-none'>{language.glyph}</span>,
        disabled: language.status !== 'ready',
    }));

    const handleChange = (id: Languages) => {
        save({ targetLang: id });
        const next = new URLSearchParams(searchParams);
        next.set('target', targetCode(id));
        setSearchParams(next, { preventScrollReset: true });
    };

    return (
        <Select
            value={targetLang}
            options={options}
            onChange={handleChange}
            placeholder={t('deck.target')}
            icon={<FaGlobe className='h-3.5 w-3.5' />}
            className={className}
        />
    );
}
