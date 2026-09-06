// -Path: "src/auth/auth.module.ts"
import { AuthMiddleware } from './auth.middleware';
import { type MiddlewareConsumer, Module } from '@nestjs/common';

@Module({
    imports: [],
    providers: [AuthMiddleware],
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*');
    }
}
