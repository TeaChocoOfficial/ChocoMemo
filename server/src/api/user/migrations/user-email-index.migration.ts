import { InjectModel } from '@nestjs/mongoose';
import { Logger, type OnApplicationBootstrap } from '@nestjs/common';
import type { Model } from 'mongoose';
import { nameDB } from '~/hooks/mongodb';
import { User, type UserDocument } from '../schemas/user.schema';

const INDEX_KEY = 'identities.providerEmail';
const INDEX_KEYS = { [INDEX_KEY]: 1 } as const;
const INDEX_NAME = `${INDEX_KEY}_1`;

const DESIRED_OPTIONS = {
    unique: true,
    partialFilterExpression: { [INDEX_KEY]: { $type: 'string' } },
};

/**
 * Brings the `identities.providerEmail` index in line with `UserSchema`.
 *
 * It used to be `{ unique: true, sparse: true }`, which cannot express "unique
 * per real email" because `sparse` still indexes a field that is present with
 * a `null` value. Providers that don't return an email (LINE, and X without the
 * `users.email` grant) all store `null`, so every email-less account competed
 * for the same unique key and the second signup failed with `EMAIL_IN_USE`.
 *
 * MongoDB will not replace an index whose key matches but whose options differ
 * — it rejects the create with `IndexOptionsConflict` and leaves the old
 * definition enforcing uniqueness. Editing the schema alone therefore does
 * nothing to an already-provisioned database, so the stale index is dropped and
 * rebuilt here.
 *
 * Idempotent: once the index matches, this is a no-op. Deliberately scoped to
 * this one index rather than `syncIndexes()`, which would also drop any index
 * created outside the schemas.
 */
export class UserEmailIndexMigration implements OnApplicationBootstrap {
    private readonly logger = new Logger(UserEmailIndexMigration.name);

    constructor(
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const collection = this.userModel.collection;

        let existing;
        try {
            existing = await collection.indexes();
        } catch (error) {
            this.logger.warn(`Could not read indexes: ${(error as Error).message}`);
            return;
        }

        const current = existing.find((index) => index.name === INDEX_NAME);

        if (current && !this.isStale(current)) {
            return;
        }

        if (current) {
            try {
                await collection.dropIndex(INDEX_NAME);
                this.logger.log(`Dropped stale sparse index ${INDEX_NAME}`);
            } catch (error) {
                this.logger.error(`Failed to drop ${INDEX_NAME}: ${(error as Error).message}`);
                return;
            }
        }

        try {
            await collection.createIndex(INDEX_KEYS, DESIRED_OPTIONS);
            this.logger.log(`${INDEX_NAME} is now unique per non-empty email`);
        } catch (error) {
            // Not fatal: sign-up still works for everyone except a second
            // email-less account, and the schema definition remains the
            // source of truth for fresh databases.
            this.logger.error(`Failed to create ${INDEX_NAME}: ${(error as Error).message}`);
        }
    }

    /** An index needs replacing when it still enforces uniqueness on `null`. */
    private isStale(index: { sparse?: boolean; partialFilterExpression?: unknown }): boolean {
        if (index.sparse) return true;
        if (!index.partialFilterExpression) return true;
        return !(
            index.partialFilterExpression as Record<string, Record<string, string>> | undefined
        )?.[INDEX_KEY]?.$type;
    }
}
