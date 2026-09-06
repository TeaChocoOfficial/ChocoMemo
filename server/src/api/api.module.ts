// -Path: "Nest TypeScript/src/api/api.module.ts"
import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ImgModule } from './img/img.module';
import { UserModule } from './user/user.module';
import { SocketModule } from './socket/socket.module';

@Module({
    exports: [ApiService],
    providers: [ApiService],
    imports: [SocketModule, ImgModule, UserModule],
})
export class ApiModule {}
