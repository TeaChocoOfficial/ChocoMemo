// -Path: "Nest TypeScript/src/secure/secure.module.ts"
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { SecureService } from './secure.service';
import { validationSchema } from './schema/validation.schema';

@Global()
@Module({
    exports: [SecureService],
    providers: [SecureService],
    imports: [ConfigModule.forRoot({ isGlobal: true, validationSchema })],
})
export class SecureModule {}
