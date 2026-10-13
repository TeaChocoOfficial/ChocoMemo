// -Path: 'client/app/components/edit/LayoutPanel.tsx'
import Switch from '~/components/custom/Switch';
import { useTranslation } from 'react-i18next';
import { useDockviewStore } from '~/stores/config/dockview.store';
import type { IDockviewPanelProps } from 'dockview-react';

/** Dockview panel with the workspace layout options — currently the spaced
 *  mode toggle. */
export default function LayoutPanel(_props: IDockviewPanelProps) {
    const { t } = useTranslation();
    const spaced = useDockviewStore((state) => state.spaced);
    const setSpaced = useDockviewStore((state) => state.setSpaced);

    return (
        <div className='p-3'>
            <Switch
                checked={spaced}
                label={t('deck.edit.spacedLabel')}
                description={t('deck.edit.spacedHint')}
                onCheckedChange={setSpaced}
            />
        </div>
    );
}
