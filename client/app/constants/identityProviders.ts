import { AuthProvider } from '~/types/auth';
import type { IconType } from 'react-icons';
import { FaGoogle, FaKey, FaDiscord, FaLine, FaXTwitter } from 'react-icons/fa6';

/**
 * Display metadata for a login provider.
 *
 * Every entry is keyed by `AuthProvider` and rendered from this list, so adding
 * a provider means adding an enum member and one entry here. `available` marks
 * whether the backend exposes the OAuth flow yet: unavailable providers are
 * hidden from the "linked accounts" list rather than shown as dead buttons.
 */
export interface ProviderMeta {
    key: AuthProvider;
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
        key: AuthProvider.DISCORD,
        labelKey: 'profile.identities.discord',
        icon: FaDiscord,
        color: '#5865f2',
        available: true,
    },
    {
        key: AuthProvider.LINE,
        labelKey: 'profile.identities.line',
        icon: FaLine,
        color: '#06c755',
        available: true,
    },
    {
        key: AuthProvider.X,
        labelKey: 'profile.identities.x',
        icon: FaXTwitter,
        // X's mark is monochrome, so it follows the theme rather than a hex.
        color: 'foreground',
        available: true,
    },
];

/** Look up display metadata for a given provider key. */
export function getProviderMeta(key: ProviderMeta['key']) {
    return PROVIDER_META.find((meta) => meta.key === key);
}

/**
 * Brand color ready for inline `style`. `foreground` resolves to the active
 * theme's text token so a monochrome mark follows light/dark, matching how
 * `Button` resolves `brandColor`. Returns `null` when the provider has no
 * color, so callers can skip the tint rather than emit invalid CSS.
 */
export function resolveProviderColor(color?: string): string | null {
    if (!color) return null;
    return color === 'foreground' ? 'var(--color-surface-foreground)' : color;
}
