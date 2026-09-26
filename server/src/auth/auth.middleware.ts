// -Path: "Nest TypeScript/src/auth/auth.middleware.ts"
import { timingSafeEqual } from 'node:crypto';
import { SecureService } from '../secure/secure.service';
import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'node:http';

type NextFunction = (err?: unknown) => void;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    logger = new Logger(AuthMiddleware.name);

    private readonly publicPaths = [
        '/',
        '/public',
        '/api/img',
        '/socket-ui',
        '/api/user/auth/google',
        '/api/user/auth/google/callback',
        '/api/user/auth/discord/callback',
    ];

    constructor(private readonly secureService: SecureService) {}

    use(req: IncomingMessage, res: ServerResponse, next: NextFunction) {
        const { method, headers, url = '' } = req;
        const path = url.split('?')[0];
        const clientOrigin = headers.origin || headers.referer || '';

        // 1. OPTIONS ผ่าน (CORS preflight)
        if (method === 'OPTIONS') return next();

        // 2. Public paths ผ่าน
        if (this.isPublic(path)) return next();

        // 3. Dev mode (log ชัดเจน)
        if (this.secureService.isDev()) {
            this.logger.warn(`DEV bypass: ${method} ${path}`);
            return next();
        }

        // 4. เช็ค token ทุก method
        const tokenError = this.checkToken(res, headers);
        if (tokenError) return tokenError;

        // 5. เช็ค origin (defense-in-depth)
        const originError = this.checkOrigin(res, clientOrigin);
        if (originError) return originError;

        return next();
    }

    private isPublic(path: string): boolean {
        return this.publicPaths.some((p) => path === p || path.startsWith(p + '/'));
    }

    private checkOrigin(res: ServerResponse, origin: string): ServerResponse | null {
        if (!origin) {
            this.logger.warn('Missing Origin header');
            return this.sendJson(res, 400, { message: 'Bad Request: Missing Origin' });
        }

        let originHost: string;
        try {
            originHost = new URL(origin).origin;
        } catch {
            return this.sendJson(res, 400, { message: 'Bad Request: Invalid Origin' });
        }

        const allowed = this.secureService.getAllowedUrls();
        const ok = allowed.some((url) => {
            try {
                return new URL(url).origin === originHost;
            } catch {
                return false;
            }
        });

        if (ok) return null;

        this.logger.warn(`Blocked origin: ${originHost}`);
        return this.sendJson(res, 403, { message: 'Forbidden: Origin not allowed' });
    }

    private checkToken(res: ServerResponse, headers: IncomingHttpHeaders): ServerResponse | null {
        const authHeader = headers.authorization;
        if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer '))
            return this.sendJson(res, 401, { message: 'Unauthorized: Missing API Token' });

        const token = authHeader.slice(7).trim();
        if (!token) return this.sendJson(res, 401, { message: 'Unauthorized: Empty Token' });

        const { API_TOKEN_KEY } = this.secureService.getEnvConfig();
        if (API_TOKEN_KEY && this.safeEqual(token, API_TOKEN_KEY)) return null;

        return this.sendJson(res, 403, { message: 'Forbidden: Invalid API Token' });
    }

    private safeEqual(a: string, b: string): boolean {
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        if (bufA.length !== bufB.length) return false;
        return timingSafeEqual(bufA, bufB);
    }

    private sendJson(
        res: ServerResponse,
        statusCode: number,
        body: { message: string },
    ): ServerResponse {
        if (res.headersSent) return res;
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
        return res;
    }
}
