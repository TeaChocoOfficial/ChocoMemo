import { type User, AuthProvider } from '~/types/auth';

/** The account's email lives on the identities: the local identity's email takes precedence. */
export function getAccountEmail(
    user: Pick<User, 'identities'> | null | undefined,
): string | undefined {
    if (!user?.identities) return undefined;
    const local = user.identities.find((identity) => identity.provider === AuthProvider.LOCAL);
    return (
        local?.providerEmail ??
        user.identities.find((identity) => identity.providerEmail)?.providerEmail ??
        undefined
    );
}
