// -Path: "server/src/api/user/auth/service/auth-hash.service.ts"
import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { SecureService } from '../../../../secure/secure.service';

@Injectable()
export class AuthHashService {
    constructor(private readonly secureService: SecureService) {}

    async hash(value: string): Promise<string> {
        const { PASSWORD_HASH_SALT } = this.secureService.getEnvConfig();

        if (!PASSWORD_HASH_SALT) throw new Error('PASSWORD_HASH_SALT is not defined');
        try {
            return await argon2.hash(value, {
                type: argon2.argon2id,
                timeCost: 3,
                parallelism: 4,
                memoryCost: 64 * 1024, // 64 MB
            });
        } catch (error) {
            if (!(error instanceof Error)) throw new Error('Unknown error', { cause: error });
            throw new Error('Error hashing password', { cause: error });
        }
    }

    async verify(value: string, storedHash: string = ''): Promise<boolean> {
        try {
            return await argon2.verify(storedHash, value);
        } catch (error) {
            if (!(error instanceof Error)) throw new Error('Unknown error', { cause: error });
            throw new Error('Error verifying password', { cause: error });
        }
    }
}