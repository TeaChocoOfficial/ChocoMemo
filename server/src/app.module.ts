// -Path: "Nest TypeScript/src/app.module.ts"
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { importCache } from './hooks/cache';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { SecureModule } from './secure/secure.module';
import { SocketModule } from './api/socket/socket.module';

@Module({
    providers: [AppService],
    controllers: [AppController],
    imports: [AuthModule, ApiModule, SocketModule, SecureModule, importCache('global')],
})
export class AppModule {}
