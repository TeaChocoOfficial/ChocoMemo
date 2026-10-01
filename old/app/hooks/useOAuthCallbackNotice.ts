// -Path: 'client/app/hooks/useOAuthCallbackNotice.ts'
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSwal } from './useSwal';

/**
 * Surfaces a failed OAuth *sign-in* on whatever page the provider redirected
 * back to.
 *
 * `authAPI.*Login` sends the current pathname as `redirect_uri`, so the server
 * can land the visitor anywhere in the app — not just `/profile`, which is the
 * only place that used to read these params. Without this hook a failed
 * provider round trip returned a bare `?error=...&source=login` that nothing
 * read, so the failure was silent.
 *
 * Disconnect results are deliberately left to `ProfilePage`: unlinking only
 * ever starts from the profile route, and it owns that copy.
 */
export function useOAuthCallbackNotice() {
    const swal = useSwal();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');
        const source = searchParams.get('source');
        if (!error || source !== 'login') return;

        // The server forwards the provider's own reason, so a misconfigured
        // app (bad callback URL, missing state, denied consent) stays legible
        // instead of collapsing into one generic sentence. Matched on the full
        // code, not an `EMAIL_` prefix: the server has several distinct
        // `EMAIL_*` codes (`EMAIL_IN_USE`, `EMAIL_NOT_VERIFIED`,
        // `EMAIL_NOT_FOUND`, `EMAIL_TAKEN`) and prefix-matching them all into
        // "email already exists" reports a conflict that never happened.
        const KNOWN_ERRORS: Record<string, string> = {
            EMAIL_IN_USE: 'auth.error.emailInUse',
            EMAIL_NOT_FOUND: 'auth.error.emailNotFound',
            NAME_TAG_TAKEN: 'auth.error.nameTagTaken',
        };

        const messageKey = KNOWN_ERRORS[error];
        swal.error(messageKey ? t(messageKey) : t('auth.error.oauth', { reason: error }));
        window.history.replaceState({}, '', window.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);
}
