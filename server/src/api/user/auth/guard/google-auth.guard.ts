// -Path: "Nest TypeScript/src/user/auth/guard/google-auth.guard.ts"
import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const redirectUri = request.query.redirect_uri;
        if (redirectUri && typeof redirectUri === 'string') {
            response.cookie('oauth_redirect_uri', redirectUri, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 10 * 60 * 1000,
                path: '/',
            });
        }

        return (await super.canActivate(context)) as boolean;
    }
}
