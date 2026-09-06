// -Path: "Nest TypeScript/src/api/socket/socket.module.ts"
import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketController } from './socket.controller';

@Module({
    controllers: [SocketController],
    exports: [SocketGateway, SocketService],
    providers: [SocketGateway, SocketService],
})
export class SocketModule {}
