// -Path: "Nest TypeScript/src/api/socket/socket.middleware.ts"
import type { Socket } from 'socket.io';
import { SecureService } from '../../secure/secure.service';
import { Injectable, type NestMiddleware } from '@nestjs/common';

@Injectable()
export class SocketMiddleware implements NestMiddleware {
    constructor(private secureService: SecureService) {}

    use(socket: Socket, next: (err?: Error) => void) {
        if (this.secureService.isDev()) return next();
        const { handshake } = socket;
        const tokenKey = handshake.auth.tokenKey || handshake.query.tokenKey;
        if (!tokenKey) return next(new Error('Token key not provided'));
        if (typeof tokenKey === 'string' && tokenKey.startsWith('Bearer ')) {
            const token = tokenKey.split(' ')[1];
            const { API_TOKEN_KEY } = this.secureService.getEnvConfig();
            if (token === API_TOKEN_KEY) return next();
            return next(new Error('Forbidden'));
        }
        return next(new Error('Unauthorized'));
    }
}
