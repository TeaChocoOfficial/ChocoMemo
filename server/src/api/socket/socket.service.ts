// -Path: "Nest TypeScript/src/api/socket/socket.service.ts"
import type { Server, Socket } from 'socket.io';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';

@Injectable()
export class SocketService {
    server: Server;
    logger = new Logger(SocketService.name);

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    setServer(server: Server) {
        this.server = server;
    }

    getUser(client: Socket) {
        return client.handshake.auth.user;
    }
}
