// -Path: "Nest TypeScript/src/hooks/cache.ts"
import { CacheModule } from '@nestjs/cache-manager';
import { SecureService } from '../secure/secure.service';

export function importCache(store: string) {
    return CacheModule.registerAsync({
        isGlobal: true,
        inject: [SecureService],
        useFactory: async (secureService: SecureService) => ({
            store,
            max: 100,
            ttl: 5 * 60 * 1000,
        }),
    });
}
