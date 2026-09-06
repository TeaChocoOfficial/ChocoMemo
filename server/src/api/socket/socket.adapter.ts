// -Path: "Nest TypeScript/src/api/socket/socket.adapter.ts"
import { instrument } from '@socket.io/admin-ui';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketMiddleware } from './socket.middleware';
import { type ServerOptions, type Socket } from 'socket.io';
import { SecureService } from '../../secure/secure.service';
import { type INestApplicationContext, Logger } from '@nestjs/common';

interface BasicAuthentication {
    type: 'basic';
    username: string;
    password: string;
}

export class SocketIoAdapter extends IoAdapter {
    logger = new Logger(SocketIoAdapter.name);
    constructor(
        app: INestApplicationContext,
        private secureService: SecureService,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const isDev = this.secureService.isDev();
        const allowedUrls = this.secureService.getAllowedUrls();
        const origin: string[] = ['https://admin.socket.io', ...allowedUrls];

        const server = super.createIOServer(port, {
            ...options,
            path: '/socket.io',
            serveClient: options?.serveClient ?? true,
            cors: {
                origin: (
                    requestOrigin: string | undefined,
                    callback: (err: Error | null, allow?: boolean) => void,
                ) => {
                    if (isDev || !requestOrigin || origin.includes(requestOrigin))
                        callback(null, true);
                    else callback(new Error('Not allowed by CORS'), false);
                },
                credentials: true,
                methods: ['GET', 'POST', 'OPTIONS'],
            },
        } as ServerOptions);

        server.use((socket: Socket, next: (err?: Error) => void) => {
            const middleware = new SocketMiddleware(this.secureService).use.bind(
                new SocketMiddleware(this.secureService),
            );
            middleware(socket, next);
        });

        const authentication: BasicAuthentication = {
            type: 'basic',
            username: 'admin',
            password: '$2a$12$Kcu1ONFZam17lgTXfbAVrefY/07iEcY1peQ5sBkSNhWeWh/Np2UNC',
        };
        instrument(server, {
            auth: isDev ? false : authentication,
            mode: isDev ? 'development' : 'production',
        });

        return server;
    }
}
