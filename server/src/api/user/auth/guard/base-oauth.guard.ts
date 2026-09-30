// -Path: "src/user/auth/guard/base-oauth.guard.ts"
import type { Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { ServerResponse } from 'node:http';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Injectable, type ExecutionContext } from '@nestjs/common';

export function createOAuthGuard(strategy: string): Type<any> {
    @Injectable()
    class OAuthGuard extends AuthGuard(strategy) {
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

            const cookies: string[] = [];
            const redirectUri = request.query.redirect_uri;
            if (redirectUri && typeof redirectUri === 'string') {
                cookies.push(
                    `oauth_redirect_uri=${encodeURIComponent(redirectUri)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
                );
            }
            if (request.query.mode === 'disconnect') {
                cookies.push('oauth_disconnect=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=600');
            }
            if (cookies.length > 0) {
                reply.raw.setHeader('Set-Cookie', cookies);
            }

            return (await super.canActivate(context)) as boolean;
        }

        handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: number) {
            if (err || !user) {
                const request = context.switchToHttp().getRequest<FastifyRequest>();
                const message = (err instanceof Error && err.message) || info?.message;
                (request as FastifyRequest & { oauthError?: string }).oauthError =
                    (message as string) || 'access_denied';
                return false;
            }
            return user;
        }
    }
    return OAuthGuard;
}

// ใช้งาน
export const GoogleAuthGuard = createOAuthGuard('google');
export const DiscordAuthGuard = createOAuthGuard('discord');
export const LineAuthGuard = createOAuthGuard('line');
export const XAuthGuard = createOAuthGuard('x');
