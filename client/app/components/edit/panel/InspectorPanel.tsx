// -Path: 'client/app/components/edit/InspectorPanel.tsx'
import PanelMessage from '../components/PanelMessage';
import { useEditor } from '../components/EditorContext';
import { useTranslation } from 'react-i18next';
import type { IDockviewPanelProps } from 'dockview-react';

/** Dockview panel showing the metadata of the selected deck. */
export default function InspectorPanel(_props: IDockviewPanelProps) {
    const { t } = useTranslation();
    const { selected } = useEditor();

    if (!selected) return <PanelMessage>{t('deck.edit.selectPrompt')}</PanelMessage>;

    const rows = [
        { label: t('deck.edit.typeLabel'), value: t(`deck.type.${selected.type}`) },
        { label: t('deck.edit.itemsLabel'), value: String(selected.contentIds.length) },
        { label: t('deck.edit.sourceLabel'), value: t(`deck.source.${selected.source}`) },
        { label: t('deck.edit.tagsLabel'), value: selected.tags.join(', ') || '—' },
    ];

    return (
        <div className='flex flex-col gap-3 overflow-y-auto p-4'>
            {rows.map((row) => (
                <div key={row.label} className='flex items-baseline justify-between gap-4'>
                    <span className='shrink-0 text-xs uppercase tracking-wider text-surface-muted'>
                        {row.label}
                    </span>
                    <span className='min-w-0 truncate text-sm text-surface-foreground'>
                        {row.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
