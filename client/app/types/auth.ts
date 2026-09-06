// -Path: "Vite-React-Router-TypeScript/src/types/auth.ts"

export interface User {
    userId: string;
    googleId?: string;
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
