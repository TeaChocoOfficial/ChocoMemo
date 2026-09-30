import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { nameDB } from '../../../hooks/mongodb';
import type { Auth } from '../../../types/auth';
import type { MulterFile } from '../../../types/multer';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Avatar, type AvatarDocument } from './schemas/avatar.schema';

/**
 * Plain avatar record returned to callers.
 * Deliberately loose (`Record<string, unknown>`) rather than re-declaring
 * every schema field: the only thing callers rely on here is `url`, and
 * widening the rest is what stops TS from trying to infer (and serialize)
 * Mongoose's full `toObject()` return type, which is what triggers
 * "The inferred type of this node exceeds the maximum length...".
 */
interface AvatarRecord extends Record<string, unknown> {
    url: string;
}

@Injectable()
export class AvatarService {
    constructor(
        @InjectModel(Avatar.name, nameDB)
        private readonly avatarModel: Model<AvatarDocument>,
    ) {}

    async create(auth: Auth, file: MulterFile): Promise<AvatarRecord> {
        if (!auth?.userId) throw new BadRequestException('Unauthorized');

        // One upload per user: upsert on the unique `userId` so re-uploads
        // replace the previous picture while keeping the same URL.
        const created: AvatarDocument | null = await this.avatarModel
            .findOneAndUpdate(
                { userId: auth.userId },
                { $set: { mimetype: file.mimetype, data: file.buffer } },
                { upsert: true, new: true, setDefaultsOnInsert: true },
            )
            .exec();

        if (!created) throw new BadRequestException('Failed to save avatar');

        const plain = created.toObject({ versionKey: false }) as Record<string, unknown>;
        return { ...plain, url: `/api/avatar/${created._id}` };
    }

    async findOneRaw(id: string): Promise<AvatarDocument | null> {
        return this.avatarModel.findById(id).exec();
    }

    /** Delete an avatar image, enforcing ownership. */
    async removeOwn(auth: Auth, id: string): Promise<AvatarDocument> {
        const deleted: AvatarDocument | null = await this.avatarModel
            .findOneAndDelete({ _id: id, userId: auth?.userId })
            .exec();
        if (!deleted) throw new BadRequestException('Unauthorized');
        return deleted;
    }
}
