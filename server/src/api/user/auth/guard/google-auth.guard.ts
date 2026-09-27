// -Path: "Nest TypeScript/src/user/auth/guard/google-auth.guard.ts"
import { AuthGuard } from '@nestjs/passport';
import type { ServerResponse } from 'node:http';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Injectable, type ExecutionContext } from '@nestjs/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    // Passport's OAuth2 strategy writes Express-style to the response
    // (statusCode / setHeader / end). Fastify's `reply` implements none of
    // that API, so hand passport the underlying Node http.ServerResponse.
    getResponse(context: ExecutionContext): ServerResponse {
        const reply = context.switchToHttp().getResponse<FastifyReply>();
        return reply.raw;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const reply = context.switchToHttp().getResponse<FastifyReply>();

        // Passport writes and ends directly on `reply.raw`, bypassing Fastify's
        // send pipeline — so cookies must be set on the raw response headers or
        // they never reach the browser.
        const cookies: string[] = [];
        const redirectUri = request.query.redirect_uri;
        if (redirectUri && typeof redirectUri === 'string') {
            cookies.push(
                `oauth_redirect_uri=${encodeURIComponent(redirectUri)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
            );
        }
        // `mode=disconnect` means the OAuth round trip is a re-verification used
        // to authorize unlinking Google from the signed-in account.
        if (request.query.mode === 'disconnect') {
            cookies.push('oauth_disconnect=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=600');
        }
        if (cookies.length > 0) {
            reply.raw.setHeader('Set-Cookie', cookies);
        }

        return (await super.canActivate(context)) as boolean;
    }

    // When Google refuses authentication (e.g. the user dismisses the consent
    // screen -> `error=access_denied`, no `code` is returned), passport calls
    // `fail`, so here `user` is falsy. Throwing (the default) would leave the
    // visitor on the callback URL with a bare 401. Instead we record why OAuth
    // failed and let the controller redirect back to the client with the error.
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: number) {
        if (err || !user) {
            const request = context.switchToHttp().getRequest<FastifyRequest>();
            const message = (err instanceof Error && err.message) || (info as any)?.message;
            (request as FastifyRequest & { oauthError?: string }).oauthError =
                (message as string) || 'access_denied';
            return false;
        }
        return user;
    }
}