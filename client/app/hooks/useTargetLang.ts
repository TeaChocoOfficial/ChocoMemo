// -Path: 'client/app/hooks/useTargetLang.ts'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { Languages } from '~/data/language';
import { targetFromCode } from '~/utils/targetLang';
import { DEFAULT_TARGET_LANG, useTargetLangStore } from '~/stores/config/targetLang.store';

/**
 * Resolves the active target language: the `?target=` query first (shareable
 * and readable during SSR), then the persisted choice, then the default.
 *
 * The persisted value is only read after mount, so the server render and the
 * client's first paint agree on the default and React reports no hydration
 * mismatch when a viewer has previously chosen a non-default language.
 */
export function useTargetLang(): Languages {
    const [searchParams] = useSearchParams();
    const stored = useTargetLangStore((state) => state.targetLang);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => setHydrated(true), []);

    const fromQuery = targetFromCode(searchParams.get('target'));
    if (fromQuery) return fromQuery;
    return hydrated ? stored : DEFAULT_TARGET_LANG;
}
