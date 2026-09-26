// -Path: "Vite-React-Router-TypeScript/src/types/auth.ts"

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    DISCORD = 'discord',
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
    /** Public handle used to find this user. English only, no spaces. */
    nameTag: string;
    /** Short self-description shown on the public profile. */
    bio?: string;
    avatar?: string;
    role?: Role;
    emailVerified?: boolean;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    identities?: AuthIdentity[];
}
