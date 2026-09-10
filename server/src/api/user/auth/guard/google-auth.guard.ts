// -Path: "Nest TypeScript/src/user/auth/guard/google-auth.guard.ts"
import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { FastifyReply } from 'fastify';
import type { ServerResponse } from 'node:http';

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

        const redirectUri = request.query.redirect_uri;
        if (redirectUri && typeof redirectUri === 'string') {
            // Passport writes and ends directly on `reply.raw`, bypassing
            // Fastify's send pipeline — so the cookie must be set on the raw
            // response headers or it never reaches the browser.
            reply.raw.setHeader(
                'Set-Cookie',
                `oauth_redirect_uri=${encodeURIComponent(redirectUri)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
            );
        }

        return (await super.canActivate(context)) as boolean;
    }
}