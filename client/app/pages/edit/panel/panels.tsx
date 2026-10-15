// -Path: 'client/app/components/edit/dockview/panels.tsx'
import EditorPanel from './EditorPanel';
import LayoutPanel from './LayoutPanel';
import PreviewPanel from './PreviewPanel';
import ActivityPanel from './ActivityPanel';
import DeckListPanel from './DeckListPanel';
import InspectorPanel from './InspectorPanel';
import type { FunctionComponent } from 'react';
import type { IDockviewPanelProps } from 'dockview-react';

/** One dockable panel: what it renders, its title, and where it starts. */
export interface PanelDefinition {
    /** Component id, and the panel's stable id (each panel is a singleton). */
    id: string;
    component: FunctionComponent<IDockviewPanelProps>;
    /** i18n key for the tab title. */
    titleKey: string;
    /** Whether the "+" menu can (re)open it. Rails are always mounted. */
    addable?: boolean;
    /** Whether it starts in the default layout. Defaults to `true`; set `false`
     *  for a chooser-only panel that is added on demand. */
    defaultLayout?: boolean;
    initialWidth?: number;
    minimumWidth?: number;
    maximumWidth?: number;
    /** Where the panel sits in the initial layout. */
    position?: {
        referencePanel: string;
        direction: 'left' | 'right' | 'above' | 'below';
    };
}

/** The activity panel's starting width, in pixels. */
export const ACTIVITY_WIDTH = 220;
/** The narrowest the activity panel may be dragged, in pixels. */
export const ACTIVITY_MIN_WIDTH = 180;
/** The widest the activity panel may be dragged, in pixels. */
export const ACTIVITY_MAX_WIDTH = 360;
/** The inspector column's starting width, in pixels. */
export const INSPECTOR_WIDTH = 280;

/**
 * Every panel the workspace knows about. This is the single place to add a
 * dockable component: add a row here and it appears in the default layout and
 * in the "+" menu, with no other change. Order matters — a panel may only
 * reference panels declared before it in its `position`.
 */
export const PANEL_DEFS: PanelDefinition[] = [
    {
        id: 'activity',
        component: ActivityPanel,
        titleKey: 'deck.edit.addPanel',
        addable: false,
        defaultLayout: true,
    },
    {
        id: 'list',
        component: DeckListPanel,
        titleKey: 'deck.edit.listTitle',
        position: { referencePanel: 'activity', direction: 'right' },
        defaultLayout: true,
    },
    {
        id: 'editor',
        component: EditorPanel,
        titleKey: 'deck.edit.panelTitle',
        position: { referencePanel: 'list', direction: 'right' },
        defaultLayout: true,
    },
    {
        id: 'inspector',
        component: InspectorPanel,
        titleKey: 'deck.edit.inspectorTitle',
        initialWidth: INSPECTOR_WIDTH,
        position: { referencePanel: 'editor', direction: 'right' },
        defaultLayout: true,
    },
    {
        id: 'preview',
        component: PreviewPanel,
        titleKey: 'deck.edit.previewTitle',
        position: { referencePanel: 'editor', direction: 'below' },
        defaultLayout: true,
    },
    {
        id: 'layout',
        component: LayoutPanel,
        titleKey: 'deck.edit.layoutTitle',
        position: { referencePanel: 'list', direction: 'below' },
        defaultLayout: true,
    },
];

/** The `components` map `DockviewReact` expects, derived from the registry. */
export const PANEL_COMPONENTS = Object.fromEntries(
    PANEL_DEFS.map((def) => [def.id, def.component]),
) as Record<string, FunctionComponent<IDockviewPanelProps>>;
