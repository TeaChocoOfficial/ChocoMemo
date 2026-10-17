// -Path: 'client/app/pages/edit/panel/SettingPanel.tsx'
import Switch from '~/components/custom/Switch';
import { useTranslation } from 'react-i18next';
import type { IDockviewPanelProps } from 'dockview-react';
import { useDockviewStore } from '~/stores/config/dockview.store';
import LanguageSwitcher from '~/components/config/LanguageSwitcher';

/** Dockview panel with the workspace settings — currently the spaced mode
 *  toggle. */
export default function SettingPanel(_props: IDockviewPanelProps) {
    const { t } = useTranslation();
    const spaced = useDockviewStore((state) => state.spaced);
    const setSpaced = useDockviewStore((state) => state.setSpaced);

    return (
        <div className='p-3 space-y-2'>
            <Switch
                checked={spaced}
                onCheckedChange={setSpaced}
                label={t('deck.edit.spacedLabel')}
                description={t('deck.edit.spacedHint')}
            />
            <div className='flex'>
                <LanguageSwitcher />
            </div>
        </div>
    );
}
