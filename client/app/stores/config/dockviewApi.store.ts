// -Path: 'client/app/stores/config/dockviewApi.store.ts'
import type { DockviewApi } from 'dockview-react';

/**
 * The editor workspace's live dockview api, held in a module-level ref so it
 * behaves like `useRef`: always current, no re-renders, readable from anywhere.
 * `Dockviews` sets it when the workspace is ready and clears it on unmount.
 */
export const dockviewApiRef: { current: DockviewApi | null } = { current: null };
