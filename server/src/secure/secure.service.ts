// -Path: "Nest TypeScript/src/secure/secure.service.ts"
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type EnvConfig, envConfigs } from './dto/secure.dto';

@Injectable()
export class SecureService {
    constructor(private readonly configService: ConfigService) {}

    isDev = () => this.getEnvConfig().NODE_ENV === 'development';

    getEnvConfig = (): EnvConfig =>
        envConfigs.reduce((acc, key) => {
            const value = this.configService.get<string>(key);
            if (value === undefined) throw new Error(`Missing ${key}`); // ⚠️
            return { ...acc, [key]: value };
        }, {});

    getAllowedUrls(): string[] {
        const env = this.getEnvConfig();
        const allowedUrls = [env.CLIENT_URL ?? 'http://127.0.0.1:3000'];
        allowedUrls.push('http://192.168.1.123:5173');
        return allowedUrls;
    }
}
