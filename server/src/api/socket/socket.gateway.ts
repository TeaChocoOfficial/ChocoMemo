// -Path: "Nest TypeScript/src/api/socket/socket.gateway.ts"
import {
    WebSocketServer,
    WebSocketGateway,
    type OnGatewayInit,
    type OnGatewayConnection,
    type OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import type { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    logger = new Logger(SocketGateway.name);

    constructor(private socketService: SocketService) {}

    afterInit(server: Server) {
        this.socketService.setServer(server);
        this.logger.log('Socket.io server initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        this.broadcastPlayerCount();
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.broadcastPlayerCount();
    }

    private broadcastPlayerCount() {
        const count = this.server?.sockets?.sockets?.size ?? 0;
        this.logger.fatal(`Player count: ${count}`);
        this.server.emit('playersSync', { count });
    }
}
