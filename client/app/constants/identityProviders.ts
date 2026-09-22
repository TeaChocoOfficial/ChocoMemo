import type { IconType } from 'react-icons';
import { FaGoogle, FaKey, FaDiscord, FaLine, FaFacebook, FaXTwitter } from 'react-icons/fa6';
import { AuthProvider } from '~/types/auth';

/**
 * Display metadata for a login provider.
 * `key` matches `AuthProvider` for providers the backend already supports
 * (local, google). Providers not yet in `AuthProvider` are listed here with
 * `available: false` so the "linked accounts" UI is ready before the
 * backend ships them — add them to `AuthProvider` and flip `available` to
 * `true` once the OAuth flow exists.
 */
export interface ProviderMeta {
    key: AuthProvider | 'discord' | 'line' | 'facebook' | 'x';
    labelKey: string;
    icon: IconType;
    color?: string;
    available: boolean;
}

export const PROVIDER_META: ProviderMeta[] = [
    {
        key: AuthProvider.LOCAL,
        labelKey: 'profile.identities.local',
        icon: FaKey,
        color: '#6b7280',
        available: true,
    },
    {
        key: AuthProvider.GOOGLE,
        labelKey: 'profile.identities.google',
        icon: FaGoogle,
        color: '#ea4335',
        available: true,
    },
    {
        key: 'discord',
        labelKey: 'profile.identities.discord',
        icon: FaDiscord,
        color: '#5865f2',
        available: false,
    },
    {
        key: 'line',
        labelKey: 'profile.identities.line',
        icon: FaLine,
        color: '#06c755',
        available: false,
    },
    {
        key: 'facebook',
        labelKey: 'profile.identities.facebook',
        icon: FaFacebook,
        color: '#1877f2',
        available: false,
    },
    {
        key: 'x',
        labelKey: 'profile.identities.x',
        icon: FaXTwitter,
        available: false,
    },
];

/** Look up display metadata for a given provider key. */
export function getProviderMeta(key: ProviderMeta['key']) {
    return PROVIDER_META.find((meta) => meta.key === key);
}
