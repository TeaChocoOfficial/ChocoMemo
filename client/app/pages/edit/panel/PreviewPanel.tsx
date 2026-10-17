// -Path: 'client/app/components/edit/PreviewPanel.tsx'
import PanelMessage from '../components/PanelMessage';
import { useEditor } from '~/hooks/editor/useEditor';
import { useTranslation } from 'react-i18next';
import { useDeckPreview } from '../../../hooks/editor/useDeckPreview';
import type { IDockviewPanelProps } from 'dockview-react';

/** Dockview panel previewing the content of the selected deck. */
export default function PreviewPanel(_props: IDockviewPanelProps) {
    const { t } = useTranslation();
    const { selected } = useEditor();
    const items = useDeckPreview(selected);

    if (!selected) return <PanelMessage>{t('deck.edit.selectPrompt')}</PanelMessage>;
    if (items.length === 0) return <PanelMessage>{t('deck.edit.previewEmpty')}</PanelMessage>;

    return (
        <ol className='m-0 flex list-none flex-col gap-1.5 overflow-y-auto p-3'>
            {items.map((item, index) => (
                <li
                    key={item.id}
                    className='flex items-baseline gap-3 rounded-sm border border-line bg-surface px-3 py-2'
                >
                    <span className='font-mono text-[11px] text-surface-muted'>{index + 1}</span>
                    <span className='min-w-0 flex-1'>
                        <span className='block truncate text-sm font-medium text-surface-foreground'>
                            {item.primary}
                        </span>
                        {item.secondary && (
                            <span className='block truncate text-xs text-surface-muted'>
                                {item.secondary}
                            </span>
                        )}
                    </span>
                </li>
            ))}
        </ol>
    );
}
