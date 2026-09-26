// -Path: "Nest TypeScript/src/user/auth/guard/discord-auth.guard.ts"
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import type { ServerResponse } from 'node:http';
import { Injectable, type ExecutionContext } from '@nestjs/common';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
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
        // they never reach the browser. This is what carries the client's
        // `?redirect_uri=` (locale + path) across the Discord round trip.
        const cookies: string[] = [];
        const redirectUri = request.query.redirect_uri;
        if (redirectUri && typeof redirectUri === 'string') {
            cookies.push(
                `oauth_redirect_uri=${encodeURIComponent(redirectUri)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
            );
        }
        // `mode=disconnect` means the round trip is a re-verification used to
        // authorize unlinking Discord from the signed-in account.
        if (request.query.mode === 'disconnect') {
            cookies.push('oauth_disconnect=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=600');
        }
        if (cookies.length > 0) {
            reply.raw.setHeader('Set-Cookie', cookies);
        }

        return (await super.canActivate(context)) as boolean;
    }

    // When Discord refuses authentication (the user dismisses the consent
    // screen, or denies the `email` scope), passport calls `fail` and `user`
    // is falsy. Throwing would strand the visitor on the callback URL with a
    // bare 401, so record why it failed and let the controller redirect back
    // to the client with the reason.
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
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
