// -Path: 'client/app/services/user.ts'
import { z } from 'zod';
import serverRest, { schemaParse } from './axios';

/** A public identity: provider name and avatar only. The server deliberately
 *  omits `providerEmail` from this projection, so it is absent by design. */
const publicIdentitySchema = z.object({
    provider: z.string(),
    avatar: z.string().nullish(),
    hasPassword: z.boolean().optional(),
});

/** Shape returned by the unauthenticated user lookups. Dates arrive as ISO
 *  strings over the wire, so they are coerced rather than trusted. */
const publicUserSchema = z.object({
    userId: z.string(),
    name: z.string().nullish(),
    nameTag: z.string().nullish(),
    bio: z.string().nullish(),
    avatar: z.string().nullish(),
    role: z.enum(['admin', 'user']).nullish(),
    emailVerified: z.boolean().optional(),
    expiresAt: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    lastLoginAt: z.coerce.date(),
    identities: z.array(publicIdentitySchema).nullish(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;

export const userAPI = {
    /** Public profile lookup by handle. Rejects on 404, so callers should treat
     *  a failure as "no such user" rather than as a broken request. */
    findByNameTag: (nameTag: string) =>
        schemaParse(
            publicUserSchema,
            serverRest.get<PublicUser>(`/user/tag/${encodeURIComponent(nameTag)}`),
        ),
};
