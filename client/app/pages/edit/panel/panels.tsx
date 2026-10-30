// -Path: 'client/app/components/edit/dockview/panels.tsx'
import SettingPanel from './SettingPanel';
import PreviewPanel from './PreviewPanel';
import ActivityPanel from './ActivityPanel';
import DeckEditPanel from './DeckEditPanel';
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
    /** Marks the panel as a mobile tab and sets its order in the single-group
     *  mobile layout, ascending. Panels without it are not mobile tabs. Ignored
     *  on desktop, where `position` describes the spatial arrangement instead. */
    mobileOrder?: number;
    initialWidth?: number;
    minimumWidth?: number;
    maximumWidth?: number;
    /** Where the panel sits in the initial layout. */
    position?: {
        referencePanel: string;
        direction: 'left' | 'right' | 'above' | 'below';
    };
    /** Hides the group's tab bar. Use for chrome panels that are not closable
     *  and have nothing to switch to (e.g. the activity chooser). */
    hideHeader?: boolean;
}

/** The activity panel's starting width, in pixels. */
export const ACTIVITY_WIDTH = 220;
/** The narrowest the activity panel may be dragged, in pixels. Zero lets the
 *  user collapse it away entirely. */
export const ACTIVITY_MIN_WIDTH = 0;
/** The widest the activity panel may be dragged, in pixels. */
export const ACTIVITY_MAX_WIDTH = 360;
/** The inspector column's starting width, in pixels. */
export const INSPECTOR_WIDTH = 280;

/**
 * Every panel the workspace knows about. This is the single place to add a
 * dockable component: add a row here and it appears in the default layout and
 * in the "+" menu, with no other change. Order matters — a panel may only
 * reference panels declared before it in its `position`. `mobileOrder` marks a
 * panel as a tab of the locked single-group mobile workspace and sets its order.
 */
export const PANEL_DEFS: PanelDefinition[] = [
    {
        id: 'activity',
        component: ActivityPanel,
        titleKey: 'deck.edit.addPanel',
        addable: false,
        hideHeader: true,
        defaultLayout: true,
        minimumWidth: ACTIVITY_MIN_WIDTH,
        maximumWidth: ACTIVITY_MAX_WIDTH,
    },
    {
        id: 'list',
        component: DeckListPanel,
        titleKey: 'deck.edit.listTitle',
        position: { referencePanel: 'activity', direction: 'right' },
        defaultLayout: true,
        mobileOrder: 1,
    },
    {
        id: 'deckEdit',
        component: DeckEditPanel,
        titleKey: 'deck.edit.panelTitle',
        position: { referencePanel: 'list', direction: 'right' },
        mobileOrder: 2,
    },
    {
        id: 'inspector',
        component: InspectorPanel,
        titleKey: 'deck.edit.inspectorTitle',
        position: { referencePanel: 'deckEdit', direction: 'right' },
        mobileOrder: 4,
    },
    {
        id: 'preview',
        component: PreviewPanel,
        titleKey: 'deck.edit.previewTitle',
        position: { referencePanel: 'deckEdit', direction: 'below' },
        mobileOrder: 3,
    },
    {
        id: 'setting',
        component: SettingPanel,
        titleKey: 'deck.edit.settingTitle',
        position: { referencePanel: 'list', direction: 'below' },
        mobileOrder: 5,
    },
];

/** The `components` map `DockviewReact` expects, derived from the registry. */
export const PANEL_COMPONENTS = Object.fromEntries(
    PANEL_DEFS.map((def) => [def.id, def.component]),
) as Record<string, FunctionComponent<IDockviewPanelProps>>;
