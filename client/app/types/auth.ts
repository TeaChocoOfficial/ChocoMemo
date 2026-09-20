// -Path: "Vite-React-Router-TypeScript/src/types/auth.ts"

export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
}

export interface AuthIdentity {
    provider: AuthProvider;
    avatar?: string | null;
    hasPassword?: boolean;
    providerEmail?: string | null;
}

export interface User {
    userId: string;
    name?: string;
    email?: string;
    avatar?: string;
    googleAvatar?: string;
    localAvatar?: string;
    role?: string;
    emailVerified?: boolean;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    identities?: AuthIdentity[];
}
