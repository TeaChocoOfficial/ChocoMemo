// -Path: 'client/app/hooks/config/useStudyBasics.ts'
import { useEffect, useState } from 'react';
import { useStudyHubStore } from '~/stores/study/studyHub.store';

/**
 * The persisted "basics hidden" preference for the study hub, read only after
 * mount. The server render and the client's first paint agree on the default
 * (shown) instead of flashing a stored preference and tripping a hydration
 * mismatch.
 *
 * @returns The boolean value, its setter, and whether storage has been read.
 */
export function useStudyBasics(): {
    hydrated: boolean;
    basicHidden: boolean;
    toggleBasicHidden: () => void;
    setBasicHidden: (hidden: boolean) => void;
} {
    const [hydrated, setHydrated] = useState(false);
    const { basicHidden, setBasicHidden, toggleBasicHidden } = useStudyHubStore();

    useEffect(() => setHydrated(true), []);

    return {
        hydrated,
        basicHidden: hydrated ? basicHidden : false,
        setBasicHidden,
        toggleBasicHidden,
    };
}
