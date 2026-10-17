// -Path: 'client/app/components/edit/dockview/theme.ts'
import type { DockviewTheme } from 'dockview-react';

/**
 * The dockview theme, always in the ChocoMemo palette so the docking chrome
 * follows the app's active theme — the `dockview-theme-choco` CSS re-points the
 * dockview variables at the app tokens. The base light/dark preset only
 * supplies the structural defaults; `spaced` adds a gap between the panels.
 *
 * @param isDark - Whether the app's current theme is dark.
 * @param spaced - Whether spaced mode is on.
 * @returns The theme object for `DockviewReact`.
 */
export function resolveDockviewTheme(isDark: boolean, spaced: boolean): DockviewTheme {
    const spacedThemes = spaced
        ? ({
              dndOverlayBorder: '2px solid var(--dv-active-sash-color)',
              dndOverlayMounting: 'absolute',
              dndPanelOverlay: 'group',
              dndTabIndicator: 'line',
              edgeGroupCollapsedSize: 44,
              gap: 10,
          } as DockviewTheme)
        : {};

    return {
        name: 'choco',
        className: `dockview-theme-nord${spaced ? '-spaced' : ''} dockview-theme ${spaced ? 'spaced' : ''}`,
        colorScheme: isDark ? 'dark' : 'light',
        ...spacedThemes,
    };
}
