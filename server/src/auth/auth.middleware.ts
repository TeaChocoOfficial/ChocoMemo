// -Path: "Nest TypeScript/src/auth/auth.middleware.ts"
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'node:http';
import { SecureService } from '../secure/secure.service';
import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';

type NextFunction = (err?: unknown) => void;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    logger = new Logger(AuthMiddleware.name);

    constructor(private readonly secureService: SecureService) {}

    private readonly publicGets = [
        '/',
        '/public**',
        '/api/img**',
        '/socket-ui',
        '/user/auth/google/callback',
    ];

    use(req: IncomingMessage, res: ServerResponse, next: NextFunction) {
        if (this.secureService.isDev()) return next();
        const { method, headers } = req;
        const clientOrigin = req.headers.origin || req.headers.referer || '';

        const path = (req.url ?? '').split('?')[0];
        const publicPaths = this.publicGets.find(
            (publicPath) =>
                path === publicPath ||
                (publicPath.endsWith('**') && path.startsWith(publicPath.slice(0, -2))),
        );

        let callback: ServerResponse | null = null;
        if (method === 'GET') {
            if (publicPaths) return next();
            callback = this.checkUrl(res, clientOrigin);
        } else {
            callback = this.checkToken(res, headers);
            if (callback === null) callback = this.checkUrl(res, clientOrigin);
        }

        if (callback === null) return next();
        return callback;
    }

    checkUrl(res: ServerResponse, origin: string): ServerResponse | null {
        const allowedUrls = this.secureService.getAllowedUrls();
        if (allowedUrls.find((allowedUrl) => origin.startsWith(allowedUrl))) return null;
        return this.sendJson(res, 400, { message: 'Bad Request: Invalid Origin' });
    }

    checkToken(res: ServerResponse, headers: IncomingHttpHeaders): ServerResponse | null {
        const authHeader = headers.authorization;
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { API_TOKEN_KEY } = this.secureService.getEnvConfig();
            if (token === API_TOKEN_KEY) return null;
            return this.sendJson(res, 403, { message: 'Forbidden: Invalid API Token' });
        }
        return this.sendJson(res, 401, { message: 'Unauthorized: Missing API Token' });
    }

    private sendJson(
        res: ServerResponse,
        statusCode: number,
        body: { message: string },
    ): ServerResponse {
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
        return res;
    }
}
