// -Path: "Vite-React-Router-TypeScript/src/types/auth.ts"

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
}

export interface AuthIdentity {
    provider: AuthProvider;
    providerEmail?: string | null;
    avatar?: string | null;
    hasPassword?: boolean;
}

export interface User {
    userId: string;
    name?: string;
    avatar?: string;
    role?: Role;
    emailVerified?: boolean;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    identities?: AuthIdentity[];
}

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
